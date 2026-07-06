import { Component, inject, OnInit, computed, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TemperatureChartComponent } from '../../components/temperature-chart/temperature-chart.component';
import { LaboratoryCardComponent } from '../../components/laboratory-card/laboratory-card.component';
import { DashboardStore } from '../../../application/dashboard.store';
import { MetricTypeStore } from '../../../application/metric-type.store';
import { TemperatureReadingStore } from '../../../application/temperature-reading.store';
import { StatCardComponent } from '../../../../shared/presentation/components/stat-card/stat-card.component';
import { AutomationStore } from '../../../../automation/application/automation.store';
import { HistoryStore } from '../../../../history/application/history.store';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatIcon } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    RouterLink,
    StatCardComponent,
    TemperatureChartComponent,
    LaboratoryCardComponent,
    MatIcon,
    MatSelectModule,
    MatFormFieldModule,
    TranslateModule
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
})
export class DashboardPageComponent implements OnInit {
  protected readonly dashboardStore = inject(DashboardStore);
  protected readonly metricTypeStore = inject(MetricTypeStore);
  private readonly temperatureStore = inject(TemperatureReadingStore);
  private readonly automationStore = inject(AutomationStore);
  private readonly historyStore = inject(HistoryStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly selectedMetricKey = this.temperatureStore.selectedMetricKey;

  readonly currentMetricType = computed(() => {
    const key = this.selectedMetricKey();
    return this.metricTypeStore.activeMetricTypes().find(t => t.key === key);
  });

  onMetricChange(key: string): void {
    this.temperatureStore.setMetricKey(key);
  }

  readonly sensorsOnlineText = computed(() => {
    const configs = this.automationStore.sensorConfigurations();
    if (!configs || configs.length === 0) return 'No info';
    const activeCount = configs.filter(s => s.isActive).length;
    return `${activeCount} / ${configs.length}`;
  });

  readonly equipmentInRangeText = computed(() => {
    const thresholds = this.automationStore.equipmentThresholds();
    if (!thresholds || thresholds.length === 0) return 'No info';
    const inRangeCount = thresholds.filter(e => e.status?.toLowerCase() === 'normal').length;
    return `${inRangeCount} / ${thresholds.length}`;
  });

  readonly complianceReportDate = computed(() => {
    const records = this.historyStore.history();
    if (!records || records.length === 0) return 'No info';
    const reportRecord = [...records]
      .filter(r =>
        r.eventType?.toLowerCase().includes('report') ||
        r.eventType?.toLowerCase().includes('compliance') ||
        r.name?.toLowerCase().includes('report') ||
        r.name?.toLowerCase().includes('compliance')
      )
      .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))[0];

    if (reportRecord) {
      return this.formatRelativeTime(reportRecord.occurredAt);
    }

    return 'No info';
  });

  readonly equipmentList = computed(() => this.automationStore.equipmentThresholds());

  ngOnInit(): void {
    this.loadData();
    const interval = setInterval(() => {
      this.loadData();
    }, 5000);

    this.destroyRef.onDestroy(() => {
      clearInterval(interval);
    });
  }

  private loadData(): void {
    this.dashboardStore.loadAll();
    this.automationStore.loadEquipmentThresholds();
    this.automationStore.loadSensorConfigurations();
    this.historyStore.loadHistory();
  }

  onPeriodChange(period: string): void {
    this.dashboardStore.loadTemperatureTrends(period);
  }

  onSearch(term: string): void {
    console.log('Searching for:', term);
  }

  getEquipmentStatusClass(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'normal') return 'ok';
    if (s === 'warning') return 'warn';
    if (s === 'critical') return 'crit';
    return 'ok';
  }

  getEquipmentStatusLabel(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'normal') return 'In Range';
    if (s === 'warning') return 'Monitor';
    if (s === 'critical') return 'Out of Range';
    return 'In Range';
  }

  getEquipmentStatusTranslationKey(status: string): string {
    const s = status?.toLowerCase();
    if (s === 'normal') return 'dashboard.status.inRange';
    if (s === 'warning') return 'dashboard.status.monitor';
    if (s === 'critical') return 'dashboard.status.outOfRange';
    return 'dashboard.status.inRange';
  }

  getEquipmentBarWidth(item: any): string {
    const min = item.minThreshold;
    const max = item.maxThreshold;
    const current = item.currentValue;
    if (max <= min) return '50%';
    const pct = ((current - min) / (max - min)) * 100;
    const clamped = Math.max(0, Math.min(100, pct));
    return `${clamped}%`;
  }

  private formatRelativeTime(dateString: string): string {
    const occurred = Date.parse(dateString);
    if (Number.isNaN(occurred)) return 'N/A';

    const now = Date.now();
    const diffMs = now - occurred;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }
}
