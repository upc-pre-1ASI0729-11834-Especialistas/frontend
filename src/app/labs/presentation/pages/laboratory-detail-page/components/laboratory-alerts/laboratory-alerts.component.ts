import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LabAlert } from '../../../../../domain/model/laboratory.entity';
import { CardComponent } from '../../../../../../shared/presentation/components/card/card.component';
import { StatusBadgeComponent } from '../../../../../../shared/presentation/components/status-badge/status-badge.component';

@Component({
  selector: 'app-laboratory-alerts',
  imports: [CardComponent, StatusBadgeComponent, RouterLink],
  templateUrl: './laboratory-alerts.component.html',
  styleUrl: './laboratory-alerts.component.css',
})
export class LaboratoryAlertsComponent {
  alerts = input.required<LabAlert[]>();

  getAlertBorderColor(severity: string): string {
    const s = severity.toLowerCase();
    if (s === 'critical') return 'color-mix(in srgb, var(--mat-sys-error) 30%, transparent)';
    if (s === 'warning') return 'color-mix(in srgb, var(--warning-color) 30%, transparent)';
    if (s === 'resolved') return 'color-mix(in srgb, var(--success-color) 30%, transparent)';
    return '';
  }

  getAlertBgColor(severity: string): string {
    const s = severity.toLowerCase();
    if (s === 'critical') return 'color-mix(in srgb, var(--mat-sys-error) 3%, transparent)';
    if (s === 'warning') return 'color-mix(in srgb, var(--warning-color) 3%, transparent)';
    if (s === 'resolved') return 'color-mix(in srgb, var(--success-color) 3%, transparent)';
    return '';
  }

  isCritical(severity: string): boolean {
    return severity.toLowerCase() === 'critical';
  }

  isWarning(severity: string): boolean {
    return severity.toLowerCase() === 'warning';
  }

  isResolved(severity: string): boolean {
    return severity.toLowerCase() === 'resolved';
  }
}
