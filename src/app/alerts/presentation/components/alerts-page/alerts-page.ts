import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

interface AlertMiniMetric {
  label: string;
  value: string;
}

interface Alert {
  title: string;
  description: string;
  severity: string;
  status: string;
  metrics: AlertMiniMetric[];
}

@Component({
  selector: 'app-alerts-page',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './alerts-page.html',
  styleUrl: './alerts-page.css',
})
export class AlertsPage {

  @ViewChild('drawer') drawer!: MatDrawer;

  selectedAlert: Alert | null = null;

  summaryCards = [
    { title: 'Critical Alerts', value: 3 },
    { title: 'Warning Alerts', value: 5 },
    { title: 'Informational', value: 12 },
    { title: 'Resolved Today', value: 24 }
  ];

  alerts: Alert[] = [
    {
      title: 'Temperature threshold exceeded',
      description: 'Sensor T-01 detected abnormal temperature levels.',
      severity: 'Critical',
      status: 'Active',
      metrics: [
        { label: 'Status', value: 'Active' },
        { label: 'Duration', value: '5 min' },
        { label: 'Current Temp', value: '42.8°C' },
        { label: 'Threshold', value: '38°C' }
      ]
    },
    {
      title: 'Humidity drop detected',
      description: 'Humidity sensor detected low humidity.',
      severity: 'Warning',
      status: 'Active',
      metrics: [
        { label: 'Status', value: 'Active' },
        { label: 'Duration', value: '2 min' },
        { label: 'Humidity', value: '20%' },
        { label: 'Threshold', value: '30%' }
      ]
    },
    {
      title: 'Unknown element detected',
      description: 'An unknown element was detected in the system.',
      severity: 'Warning',
      status: 'Active',
      metrics: [
        { label: 'Status', value: 'Active' },
        { label: 'Duration', value: '3 min' },
        { label: 'Humidity', value: '55%' },
        { label: 'Threshold', value: '15%' }
      ]
    }
  ];

  openDrawer(alert: Alert) {
    this.selectedAlert = alert;
    this.drawer.open();
  }
}
