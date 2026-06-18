import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { AlertsStore } from '../../../application/alerts.store';
import { Alert } from '../../../domain/model/alert.entity';

import { TranslateModule } from '@ngx-translate/core';

interface LocalAlert {
  id: number;
  title: string;
  location: string;
  timeAgo: string;
  sensor: string;
  description: string;
  duration?: string;
  resolvedBy?: string;
  resolvedTime?: string;
}

interface AlertGroup {
  severity: 'CRITICAL' | 'WARNING' | 'RESOLVED TODAY';
  count: number;
  colorClass: string;
  pillClass: string;
  items: LocalAlert[];
}

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule
  ],
  templateUrl: './alerts-page.html',
  styleUrl: './alerts-page.css',
})
export class AlertsPage {
  private readonly router = inject(Router);
  private readonly alertsStore = inject(AlertsStore);

  readonly currentTime = new Date();

  readonly alerts = this.alertsStore.alerts;
  readonly loading = this.alertsStore.loading;

  readonly summaryCards = computed(() => {
    const list: Alert[] = this.alerts();
    const critical = list.filter((a: Alert) => a.status.toLowerCase() !== 'resolved' && a.severity.toLowerCase() === 'critical').length;
    const warning = list.filter((a: Alert) => a.status.toLowerCase() !== 'resolved' && a.severity.toLowerCase() === 'warning').length;
    const info = list.filter((a: Alert) => a.status.toLowerCase() !== 'resolved' && a.severity.toLowerCase() === 'info').length;
    const resolved = list.filter((a: Alert) => a.status.toLowerCase() === 'resolved').length;

    return [
      { title: 'Critical', subtitle: 'alerts', value: critical, class: 'card-critical' },
      { title: 'Warning', subtitle: 'alerts', value: warning, class: 'card-warning' },
      { title: 'Informational', subtitle: 'alerts', value: info, class: 'card-info' },
      { title: 'Resolved Today', subtitle: 'alerts', value: resolved, class: 'card-resolved' }
    ];
  });

  readonly alertGroups = computed<AlertGroup[]>(() => {
    const list: Alert[] = this.alerts();
    const criticalItems = list.filter((a: Alert) => a.status.toLowerCase() !== 'resolved' && a.severity.toLowerCase() === 'critical');
    const warningItems = list.filter((a: Alert) => a.status.toLowerCase() !== 'resolved' && a.severity.toLowerCase() === 'warning');
    const resolvedItems = list.filter((a: Alert) => a.status.toLowerCase() === 'resolved');

    return [
      {
        severity: 'CRITICAL',
        count: criticalItems.length,
        colorClass: 'text-red',
        pillClass: 'pill-critical',
        items: criticalItems.map(a => this.mapToLocalAlert(a))
      },
      {
        severity: 'WARNING',
        count: warningItems.length,
        colorClass: 'text-orange',
        pillClass: 'pill-warning',
        items: warningItems.map(a => this.mapToLocalAlert(a))
      },
      {
        severity: 'RESOLVED TODAY',
        count: resolvedItems.length,
        colorClass: 'text-green',
        pillClass: 'pill-resolved',
        items: resolvedItems.map(a => this.mapToLocalAlert(a))
      }
    ];
  });

  private mapToLocalAlert(alert: Alert): LocalAlert {
    const desc = alert.description || '';
    const sensorMatch = desc.match(/Sensor\s+[\w\-]+/i);
    const sensor = sensorMatch ? sensorMatch[0] : 'Sensor T-01';

    let location = 'Main Laboratory';
    if (desc.includes('Cryo')) {
      location = 'Cryo Storage 01 — Refrigerator B2';
    } else if (desc.includes('Lab A')) {
      location = 'Lab A — CO2 Monitor';
    } else if (desc.includes('Lab D')) {
      location = 'Lab D — ULT Freezer F-07';
    } else if (desc.includes('Lab C')) {
      location = 'Lab C — HVAC Unit 3';
    }

    return {
      id: alert.id,
      title: alert.title,
      location: location,
      timeAgo: '38 min ago',
      sensor: sensor,
      description: alert.description,
      duration: '38 min',
      resolvedBy: alert.status.toLowerCase() === 'resolved' ? 'Resolved by Dr. Vance · Just now' : undefined
    };
  }

  navigateToIncident(id: number) {
    this.router.navigate(['/alerts/incident'], { queryParams: { id } });
  }
}
