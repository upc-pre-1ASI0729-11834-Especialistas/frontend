import { Component, input, computed } from '@angular/core';
import { Laboratory } from '../../../../../domain/model/laboratory.entity';
import { MatIcon } from '@angular/material/icon';
import { StatusBadgeComponent } from '../../../../../../shared/presentation/components/status-badge/status-badge.component';
import { CardComponent } from '../../../../../../shared/presentation/components/card/card.component';

@Component({
  selector: 'app-laboratory-detail-card',
  imports: [StatusBadgeComponent, CardComponent, MatIcon],
  templateUrl: './laboratory-detail-card.component.html',
  styleUrl: './laboratory-detail-card.component.css',
})
export class LaboratoryDetailCardComponent {
  lab = input.required<Laboratory>();

  cardBorderColor = computed(() => {
    const lab = this.lab();
    if (lab.isCritical()) return 'var(--mat-sys-error)';
    if (lab.isWarning()) return 'var(--warning-color)';
    return 'var(--success-color)';
  });

  statusSeverity = computed(() => {
    const lab = this.lab();
    if (lab.isCritical()) return 'critical';
    if (lab.isWarning()) return 'warning';
    return 'resolved';
  });

  sparklinePath(data: number[]): string {
    if (!data || data.length < 2) return '';
    const width = 56;
    const height = 20;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    });

    return `M${points.join(' L')}`;
  }

  barChartBars(data: number[]): { x: number; y: number; w: number; h: number }[] {
    if (!data || data.length === 0) return [];
    const width = 56;
    const height = 20;
    const max = Math.max(...data) || 1;
    const barW = Math.max(2, (width / data.length) - 2);

    return data.map((v, i) => {
      const barH = Math.max(2, (v / max) * height);
      return {
        x: i * (width / data.length) + 1,
        y: height - barH,
        w: barW,
        h: barH,
      };
    });
  }

  isBarChart(data: number[]): boolean {
    if (!data || data.length === 0) return false;
    return data.every(v => Number.isInteger(v)) && Math.max(...data) <= 10;
  }

  metricColor(label: string): string {
    const l = label.toUpperCase();
    if (l.includes('TEMP')) return 'var(--warning-color)';
    if (l.includes('AIR')) return 'var(--info-color)';
    if (l.includes('UNKNOWN')) return 'var(--error-color)';
    if (l.includes('VENT')) return 'var(--primary-color)';
    if (l.includes('CONDITION')) return 'var(--success-color)';
    if (l.includes('VIBRAT')) return 'var(--secondary-color)';
    return 'var(--mat-sys-tertiary)';
  }
}
