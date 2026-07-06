import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { AlertsStore } from '../../../application/alerts.store';
import { Alert } from '../../../domain/model/alert.entity';
import { LaboratoryStore } from '../../../../labs/application/laboratory.store';

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
  styleUrls: ['./alerts-page.css'],
})
export class AlertsPage {
  private readonly router = inject(Router);
  private readonly alertsStore = inject(AlertsStore);
  private readonly laboratoryStore = inject(LaboratoryStore);

  readonly currentTime = new Date();

  readonly alerts = this.alertsStore.alerts;
  readonly loading = this.alertsStore.loading;

  // Filter signals
  readonly searchQuery = signal('');
  readonly selectedSeverity = signal('All');
  readonly selectedLab = signal('All');
  readonly selectedStatus = signal('All');

  readonly uniqueLabs = computed(() => {
    const list = this.alerts().map(a => a.labName).filter(Boolean);
    return ['All', ...new Set(list)].sort();
  });

  readonly filteredAlerts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const severity = this.selectedSeverity();
    const lab = this.selectedLab();
    const status = this.selectedStatus();

    return this.alerts().filter(alert => {
      if (query && !alert.title.toLowerCase().includes(query) && !alert.description.toLowerCase().includes(query)) {
        return false;
      }
      if (severity !== 'All' && alert.severity.toUpperCase() !== severity.toUpperCase()) {
        return false;
      }
      if (lab !== 'All' && alert.labName !== lab) {
        return false;
      }
      if (status !== 'All' && alert.status.toUpperCase() !== status.toUpperCase()) {
        return false;
      }
      return true;
    });
  });

  readonly summaryCards = computed(() => {
    const list: Alert[] = this.alerts();
    const critical = list.filter((a: Alert) => a.status.toLowerCase() !== 'resolved' && a.severity.toLowerCase() === 'critical').length;
    const warning = list.filter((a: Alert) => a.status.toLowerCase() !== 'resolved' && a.severity.toLowerCase() === 'warning').length;
    const info = list.filter((a: Alert) => a.status.toLowerCase() !== 'resolved' && a.severity.toLowerCase() === 'info').length;
    const resolved = list.filter((a: Alert) => a.status.toLowerCase() === 'resolved').length;

    return [
      { title: 'alerts.summary.critical', subtitle: 'alerts.summary.alerts', value: critical, class: 'card-critical' },
      { title: 'alerts.summary.warning', subtitle: 'alerts.summary.alerts', value: warning, class: 'card-warning' },
      { title: 'alerts.summary.informational', subtitle: 'alerts.summary.alerts', value: info, class: 'card-info' },
      { title: 'alerts.summary.resolvedToday', subtitle: 'alerts.summary.alerts', value: resolved, class: 'card-resolved' }
    ];
  });

  readonly alertGroups = computed<AlertGroup[]>(() => {
    const list: Alert[] = this.filteredAlerts();
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

    const labs = this.laboratoryStore.allLaboratories();
    const lab = labs.find(l => l.id === alert.laboratoryId);
    const location = lab
      ? `${lab.building} — ${lab.name}`
      : (alert.labLocation || alert.labName || 'Main Laboratory');

    return {
      id: alert.id,
      title: alert.title,
      location: location,
      timeAgo: this.getTimeAgo(alert.createdAt),
      sensor: sensor,
      description: alert.description,
      duration: '38 min',
      resolvedBy: alert.status.toLowerCase() === 'resolved' ? 'Resolved · Just now' : undefined
    };
  }

  getTimeAgo(date?: Date): string {
    if (!date) return '38 min ago';
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }

  navigateToIncident(id: number) {
    this.router.navigate(['/alerts/incident'], { queryParams: { id } });
  }
}
