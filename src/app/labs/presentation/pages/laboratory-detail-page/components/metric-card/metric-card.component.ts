import { Component, input, computed } from '@angular/core';
import { LabMetric } from '../../../../../domain/model/laboratory.entity';
import { CardComponent } from '../../../../../../shared/presentation/components/card/card.component';
import { StatusBadgeComponent } from '../../../../../../shared/presentation/components/status-badge/status-badge.component';
import { IconBadgeComponent } from '../../../../../../shared/presentation/components/icon-badge/icon-badge.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-metric-card',
  imports: [CardComponent, StatusBadgeComponent, IconBadgeComponent, MatIcon],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.css',
})
export class MetricCardComponent {
  metric = input.required<LabMetric>();

  sparklinePath = computed(() => {
    const data = this.metric().sparkline;
    if (!data || data.length < 2) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 100;
    const h = 28;
    const step = w / (data.length - 1);
    return data
      .map((v, i) => {
        const x = i * step;
        const y = h - ((v - min) / range) * h;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });

  iconColor = computed(() => {
    const s = this.metric().status.toLowerCase();
    if (['warning', 'detected'].includes(s)) return 'var(--warning-color)';
    if (['critical', 'alert', 'danger'].includes(s)) return 'var(--mat-sys-error)';
    return 'var(--mat-sys-primary)';
  });
}
