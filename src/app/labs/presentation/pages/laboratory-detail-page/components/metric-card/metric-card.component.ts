import { Component, input, computed } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LabMetric } from '../../../../../domain/model/laboratory.entity';
import { StatusBadgeComponent } from '../../../../../../shared/presentation/components/status-badge/status-badge.component';

@Component({
  selector: 'app-metric-card',
  imports: [MatIcon, StatusBadgeComponent],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.css',
})
export class MetricCardComponent {
  metric = input.required<LabMetric>();

  /** SVG polyline path for the mini line chart (100×40 viewBox) */
  sparklinePath = computed(() => {
    const data = this.metric().sparkline;
    if (!data || data.length < 2) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 100;
    const h = 40;
    const step = w / (data.length - 1);
    return data
      .map((v, i) => {
        const x = i * step;
        const y = h - ((v - min) / range) * h;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });

  /** Filled area path (close down to baseline) */
  sparklineArea = computed(() => {
    const data = this.metric().sparkline;
    if (!data || data.length < 2) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 100;
    const h = 40;
    const step = w / (data.length - 1);
    const pts = data
      .map((v, i) => {
        const x = i * step;
        const y = h - ((v - min) / range) * h;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
    const lastX = ((data.length - 1) * step).toFixed(1);
    return `M0,${h} L${pts} L${lastX},${h} Z`;
  });

  iconColor = computed(() => {
    const s = this.metric().status.toLowerCase();
    if (['critical', 'alert', 'danger'].includes(s)) return 'var(--mat-sys-error)';
    if (['warning', 'detected'].includes(s)) return 'var(--warning-color)';
    return 'var(--mat-sys-primary)';
  });

  isCritical = computed(() =>
    ['critical', 'alert', 'danger'].includes(this.metric().status.toLowerCase())
  );

  isWarning = computed(() =>
    ['warning', 'detected'].includes(this.metric().status.toLowerCase())
  );

  /** Show how much the threshold was exceeded */
  thresholdExceeded = computed(() => {
    const m = this.metric();
    if (!m.threshold || !this.isCritical()) return null;
    const val = parseFloat(m.value);
    if (isNaN(val)) return null;
    const diff = (val - m.threshold).toFixed(1);
    return { threshold: m.threshold, diff };
  });

  /** Object type label (Refrigerator, Freezer, Incubator, etc.) derived from objectType or name */
  objectLabel = computed(() => {
    const m = this.metric();
    if (m.objectType) return m.objectType;
    // Try to infer from the metric name (e.g. "Refrigerator B2" → "Refrigerator")
    const known = ['Refrigerator', 'Freezer', 'Incubator', 'Storage', 'Blood Bank', 'Ambient', 'Chamber', 'Oven', 'Bath'];
    const found = known.find(k => m.name.toLowerCase().includes(k.toLowerCase()));
    return found ?? 'Equipment';
  });
}
