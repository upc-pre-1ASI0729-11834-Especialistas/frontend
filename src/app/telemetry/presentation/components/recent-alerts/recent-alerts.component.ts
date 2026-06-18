import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Alert } from '../../../domain/model/alert.entity';
import { CardComponent } from '../../../../shared/presentation/components/card/card.component';
import { StatusBadgeComponent } from '../../../../shared/presentation/components/status-badge/status-badge.component';

@Component({
  selector: 'app-recent-alerts',
  imports: [StatusBadgeComponent, CardComponent, RouterLink],
  templateUrl: './recent-alerts.component.html',
  styleUrl: './recent-alerts.component.css',
})
export class RecentAlertsComponent {
  alerts = input.required<Alert[]>();

  getAlertBorderColor(alert: Alert): string {
    if (alert.isCritical()) return 'color-mix(in srgb, var(--mat-sys-error) 30%, transparent)';
    if (alert.isWarning()) return 'color-mix(in srgb, var(--warning-color) 30%, transparent)';
    if (alert.isResolved()) return 'color-mix(in srgb, var(--success-color) 30%, transparent)';
    return '';
  }

  getAlertBgColor(alert: Alert): string {
    if (alert.isCritical()) return 'color-mix(in srgb, var(--mat-sys-error) 3%, transparent)';
    if (alert.isWarning()) return 'color-mix(in srgb, var(--warning-color) 3%, transparent)';
    if (alert.isResolved()) return 'color-mix(in srgb, var(--success-color) 3%, transparent)';
    return '';
  }
}
