import { Component, input, computed } from '@angular/core';

export type BadgeSeverity = 'critical' | 'warning' | 'resolved' | 'normal' | 'info';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css'
})
export class StatusBadgeComponent {
  severity = input.required<string>();
  label = input<string>('');
  showDot = input<boolean>(true);
  strong = input<boolean>(false);

  displayLabel = computed(() => this.label() || this.severity());

  normalizedSeverity = computed(() => {
    const s = this.severity().toLowerCase();
    if (['critical', 'alert', 'error', 'danger'].includes(s)) return 'critical';
    if (['warning', 'warn'].includes(s)) return 'warning';
    if (['resolved', 'success', 'ok'].includes(s)) return 'resolved';
    if (['normal', 'active'].includes(s)) return 'normal';
    return 'info';
  });
}
