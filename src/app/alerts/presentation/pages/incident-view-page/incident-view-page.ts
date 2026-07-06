import { Component, inject, computed, signal, effect } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EscalateSupervisorDialog } from '../escalate-dialog/escalate-supervisor-dialog';
import { AlertsStore } from '../../../application/alerts.store';
import { TemperatureReadingApi } from '../../../../telemetry/infrastructure/temperature-reading-api';
import { TemperatureReading } from '../../../../telemetry/domain/model/temperature-reading.entity';
import { TranslatePipe } from '@ngx-translate/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-incident-view-page',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatDialogModule, CommonModule, TranslatePipe, MatProgressSpinner],
  templateUrl: './incident-view-page.html',
  styleUrls: ['./incident-view-page.css'],
})
export class IncidentViewPage {
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly alertsStore = inject(AlertsStore);
  private readonly telemetryApi = inject(TemperatureReadingApi);

  readonly alertId = signal<number | null>(null);
  readonly historicalReadings = signal<TemperatureReading[]>([]);
  readonly readingsLoading = signal<boolean>(false);

  readonly isLoading = computed(() => {
    return this.alertsStore.loading() || !this.alert() || this.readingsLoading();
  });

  readonly alert = computed(() => {
    const id = this.alertId();
    return id ? this.alertsStore.getAlertById(id)() : undefined;
  });

  readonly metricKey = computed(() => {
    const title = this.alert()?.title.toLowerCase() || '';
    if (title.includes('co2')) return 'co2';
    if (title.includes('humidity')) return 'humidity';
    return 'temperature';
  });

  readonly location = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.labLocation || 'Building C - Level 1';
  });

  readonly currentValue = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.metrics?.find(m => m.label === 'currentValue')?.value || 'N/A';
  });

  readonly thresholdValue = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.metrics?.find(m => m.label === 'threshold')?.value || '8.0°C';
  });

  readonly exceededByValue = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.metrics?.find(m => m.label === 'exceededBy')?.value || 'N/A';
  });

  readonly affectedEquipment = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.equipmentName || 'Room Ambient';
  });

  readonly sensorId = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.sensorName || 'N/A';
  });

  readonly sensorType = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.metrics?.find(m => m.label === 'sensorType')?.value || 'NTC Thermistor';
  });

  readonly lastCalibration = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.metrics?.find(m => m.label === 'lastCalibration')?.value || 'N/A';
  });

  readonly signalStrength = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.metrics?.find(m => m.label === 'signalStrength')?.value || '98%';
  });

  readonly networkStatus = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.metrics?.find(m => m.label === 'networkStatus')?.value || 'ONLINE';
  });

  readonly automationRuleName = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.metrics?.find(m => m.label === 'automationRuleName')?.value || 'Cooling Enhancement Rule';
  });

  readonly automationRuleStatus = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.metrics?.find(m => m.label === 'automationRuleStatus')?.value || 'Running';
  });

  readonly automationRuleDesc = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.metrics?.find(m => m.label === 'automationRuleDesc')?.value || 'Increases cooling boost until temperature normalizes.';
  });

  readonly startedTimeAgo = computed(() => {
    const currentAlert = this.alert();
    if (!currentAlert || !currentAlert.createdAt) return '38 minutes ago';
    const diffMs = new Date().getTime() - currentAlert.createdAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    return `${diffMins} minutes ago`;
  });

  readonly startedTimeAbsolute = computed(() => {
    const currentAlert = this.alert();
    if (!currentAlert || !currentAlert.createdAt) return '08:21 AM';
    return currentAlert.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  readonly dispatchTimeAbsolute = computed(() => {
    const currentAlert = this.alert();
    if (!currentAlert || !currentAlert.createdAt) return '08:22 AM';
    const dispatchDate = new Date(currentAlert.createdAt.getTime() + 60000);
    return dispatchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  readonly automationTimeAbsolute = computed(() => {
    const currentAlert = this.alert();
    if (!currentAlert || !currentAlert.createdAt) return '08:23 AM';
    const autoDate = new Date(currentAlert.createdAt.getTime() + 120000);
    return autoDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // Dynamic Chart calculations
  readonly limits = computed(() => {
    const currentAlert = this.alert();
    if (!currentAlert) return { min: undefined, max: undefined };

    const getNum = (label: string) => {
      const metric = currentAlert.metrics?.find(m => m.label === label);
      if (!metric) return undefined;
      const match = metric.value.match(/[-?[\d\.]+/);
      return match ? parseFloat(match[0]) : undefined;
    };

    let min = getNum('minThreshold');
    let max = getNum('maxThreshold');

    // Fallback/Legacy support: if they aren't explicitly saved as minThreshold/maxThreshold,
    // look at 'threshold' and guess based on current value.
    if (min === undefined && max === undefined) {
      const thresholdVal = getNum('threshold');
      if (thresholdVal !== undefined) {
        const cur = getNum('currentValue');
        if (cur !== undefined && cur < thresholdVal) {
          min = thresholdVal;
        } else {
          max = thresholdVal;
        }
      }
    }

    return { min, max };
  });

  readonly unit = computed(() => {
    const thresh = this.thresholdValue();
    const match = thresh.match(/[^\d\.\s]+/);
    return match ? match[0] : '';
  });

  readonly currentValueAsNumber = computed(() => {
    const curStr = this.currentValue();
    const match = curStr.match(/[-?[\d\.]+/);
    return match ? parseFloat(match[0]) : 0;
  });

  readonly isMinBreach = computed(() => {
    const limits = this.limits();
    if (limits.min !== undefined && this.currentValueAsNumber() < limits.min) {
      return true;
    }
    const title = this.alert()?.title.toLowerCase() || '';
    if (title.includes('low') || title.includes('min') || title.includes('under')) {
      return true;
    }
    return false;
  });

  readonly chartBounds = computed(() => {
    const readings = this.historicalReadings();
    const labId = this.alert()?.laboratoryId?.toString();
    const limits = this.limits();

    if (!labId) {
      return { minVal: 15, maxVal: 30, valRange: 15 };
    }

    const dataPoints = readings
      .map(r => ({
        date: new Date(r.date).getTime(),
        value: r.values[labId]
      }))
      .filter(p => p.value !== undefined && !isNaN(p.value))
      .sort((a, b) => a.date - b.date);

    const valuesList = dataPoints.map(p => p.value);
    if (limits.min !== undefined) valuesList.push(limits.min);
    if (limits.max !== undefined) valuesList.push(limits.max);

    if (valuesList.length === 0) {
      return { minVal: 15, maxVal: 30, valRange: 15 };
    }

    let minVal = Math.min(...valuesList);
    let maxVal = Math.max(...valuesList);

    if (minVal === maxVal) {
      minVal -= 1;
      maxVal += 1;
    }

    // Add 5% padding so thresholds and curves don't sit hard on chart edges
    const range = maxVal - minVal;
    minVal -= range * 0.05;
    maxVal += range * 0.05;

    return { minVal, maxVal, valRange: maxVal - minVal };
  });

  getY(value: number): number {
    const { minVal, valRange } = this.chartBounds();
    const padding = 15;
    const chartHeight = 120 - 2 * padding;
    const normalized = (value - minVal) / valRange;
    const y = 120 - padding - normalized * chartHeight;
    return Math.max(5, Math.min(115, y));
  }

  readonly chartPath = computed(() => {
    const readings = this.historicalReadings();
    const labId = this.alert()?.laboratoryId?.toString();
    if (!readings.length || !labId) {
      return 'M 0 100 Q 50 100 100 105 T 200 95 T 300 40 T 400 20 L 500 25';
    }

    const dataPoints = readings
      .map(r => ({
        date: new Date(r.date).getTime(),
        value: r.values[labId]
      }))
      .filter(p => p.value !== undefined && !isNaN(p.value))
      .sort((a, b) => a.date - b.date);

    if (dataPoints.length < 2) {
      return 'M 0 60 L 500 60';
    }

    const points = dataPoints.map((p, index) => {
      const x = (index / (dataPoints.length - 1)) * 500;
      const y = this.getY(p.value);
      return { x, y };
    });

    let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}`;
    }
    return path;
  });

  readonly minThresholdY = computed(() => {
    const limits = this.limits();
    if (limits.min === undefined) return undefined;
    return this.getY(limits.min);
  });

  readonly maxThresholdY = computed(() => {
    const limits = this.limits();
    if (limits.max === undefined) return undefined;
    return this.getY(limits.max);
  });

  readonly normalRangeRect = computed(() => {
    const minTry = this.minThresholdY();
    const maxTry = this.maxThresholdY();

    if (minTry !== undefined && maxTry !== undefined) {
      return { y: maxTry, height: minTry - maxTry };
    } else if (maxTry !== undefined) {
      return { y: maxTry, height: 120 - maxTry };
    } else if (minTry !== undefined) {
      return { y: 0, height: minTry };
    }
    return { y: 0, height: 120 };
  });

  // Keep thresholdY / thresholdHeight for compatibility with any external bindings, if any
  readonly thresholdY = computed(() => {
    const max = this.maxThresholdY();
    if (max !== undefined) return max;
    const min = this.minThresholdY();
    if (min !== undefined) return min;
    return 60;
  });

  readonly thresholdHeight = computed(() => {
    return Math.max(0, 120 - this.thresholdY());
  });

  readonly xAxisLabels = computed(() => {
    const readings = this.historicalReadings();
    const labId = this.alert()?.laboratoryId?.toString();
    if (!readings.length || !labId) {
      return ['2h ago', '1.5h ago', '1h ago', '30m ago', '15m ago', 'Now'];
    }

    const dataPoints = readings
      .map(r => ({
        date: new Date(r.date),
        value: r.values[labId]
      }))
      .filter(p => p.value !== undefined && !isNaN(p.value))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (dataPoints.length < 2) {
      return ['2h ago', '1.5h ago', '1h ago', '30m ago', '15m ago', 'Now'];
    }

    const count = Math.min(6, dataPoints.length);
    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      const index = Math.floor((i / (count - 1)) * (dataPoints.length - 1));
      const date = dataPoints[index].date;
      labels.push(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    return labels;
  });

  constructor() {
    this.alertsStore.loadAlerts();

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.alertId.set(Number(id));
      }
    });

    effect(() => {
      const currentAlert = this.alert();
      if (currentAlert) {
        const key = this.metricKey();
        this.readingsLoading.set(true);
        this.telemetryApi.getReadingsByMetric(key).subscribe({
          next: readings => {
            this.historicalReadings.set(readings);
            this.readingsLoading.set(false);
          },
          error: () => {
            this.readingsLoading.set(false);
          }
        });
      }
    }, { allowSignalWrites: true });
  }

  openEscalate(): void {
    const currentAlert = this.alert();
    this.dialog.open(EscalateSupervisorDialog, {
      data: {
        equipmentName: this.affectedEquipment(),
        incidentDescription: currentAlert ? currentAlert.title : 'Temperature Critical'
      }
    });
  }
}
