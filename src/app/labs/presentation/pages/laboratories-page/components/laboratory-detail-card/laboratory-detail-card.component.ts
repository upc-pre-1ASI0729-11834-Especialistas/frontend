import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Laboratory, LabMetric } from '../../../../../domain/model/laboratory.entity';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StatusBadgeComponent } from '../../../../../../shared/presentation/components/status-badge/status-badge.component';
import { CardComponent } from '../../../../../../shared/presentation/components/card/card.component';

@Component({
  selector: 'app-laboratory-detail-card',
  imports: [StatusBadgeComponent, CardComponent, MatIcon, MatButtonModule, RouterLink],
  templateUrl: './laboratory-detail-card.component.html',
  styleUrl: './laboratory-detail-card.component.css',
})
export class LaboratoryDetailCardComponent {
  lab = input.required<Laboratory>();

  cardBorderColor = computed(() => {
    if (this.lab().isCritical()) return '#fca5a5';
    if (this.lab().isWarning()) return '#fed7aa';
    return '';
  });

  statusSeverity = computed(() => {
    if (this.lab().isCritical()) return 'critical';
    if (this.lab().isWarning()) return 'warning';
    return 'normal';
  });

  /** Temperatura principal (primera métrica de temp) */
  tempMetric = computed(() =>
    this.lab().metrics.find(m => m.name.toLowerCase().includes('temp'))
  );

  /** Resto de métricas (sin temperatura) para la fila secundaria */
  secondaryMetrics = computed(() =>
    this.lab().metrics.filter(m => !m.name.toLowerCase().includes('temp')).slice(0, 2)
  );

  /** Pill de tendencia: simula una tasa de cambio basada en los últimos valores del sparkline */
  tempTrend = computed(() => {
    const t = this.tempMetric();
    if (!t?.sparkline || t.sparkline.length < 2) return null;
    const last = t.sparkline[t.sparkline.length - 1];
    const prev = t.sparkline[t.sparkline.length - 2];
    const diff = +(last - prev).toFixed(1);
    return { diff, label: `${diff > 0 ? '+' : ''}${diff}°C/min` };
  });

  isTempCritical = computed(() => {
    const t = this.tempMetric();
    if (!t) return false;
    const s = t.status.toLowerCase();
    return ['critical', 'alert', 'error', 'danger'].includes(s);
  });

  isTempWarning = computed(() => {
    const t = this.tempMetric();
    if (!t) return false;
    const s = t.status.toLowerCase();
    return ['warning', 'warn', 'elevated', 'moderate'].includes(s);
  });

  metricSeverityClass(metric: LabMetric): string {
    const s = metric.status.toLowerCase();
    if (['critical', 'alert', 'error', 'danger'].includes(s)) return 'sev-critical';
    if (['warning', 'warn', 'elevated', 'moderate'].includes(s)) return 'sev-warning';
    return 'sev-normal';
  }

  metricIcon(metric: LabMetric): string {
    const n = metric.name.toLowerCase();
    if (n.includes('humid')) return 'water_drop';
    if (n.includes('air') || n.includes('aqi')) return 'air';
    if (n.includes('vent')) return 'hvac';
    if (n.includes('vibr')) return 'vibration';
    if (n.includes('light')) return 'light_mode';
    return 'sensors';
  }

  metricDisplayValue(metric: LabMetric): string {
    const n = metric.name.toLowerCase();
    if (n.includes('air') || n.includes('aqi')) {
      const numericStatus = ['good', 'normal', 'clear', 'excellent'].includes(metric.status.toLowerCase())
        ? metric.status : 'Elevated';
      return numericStatus;
    }
    return `${metric.value}${metric.unit}`;
  }

  metricStatusLabel(metric: LabMetric): string {
    const s = metric.status.toLowerCase();
    if (['critical', 'alert', 'error', 'danger'].includes(s)) return 'Critical ↑';
    if (['warning', 'warn', 'elevated', 'moderate'].includes(s)) return 'Elevated ↑';
    return 'Normal';
  }

  metricColor(metric: LabMetric): string {
    const s = metric.status.toLowerCase();
    if (['critical', 'alert', 'error', 'danger'].includes(s)) return '#dc2626';
    if (['warning', 'warn', 'elevated', 'moderate'].includes(s)) return '#d97706';
    return '#16a34a';
  }

  sparklinePath(data: number[]): string {
    if (!data || data.length < 2) return '';
    const w = 80, h = 28;
    const min = Math.min(...data), max = Math.max(...data);
    const range = max - min || 1;
    return 'M' + data.map((v, i) =>
      `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`
    ).join(' L');
  }
}
