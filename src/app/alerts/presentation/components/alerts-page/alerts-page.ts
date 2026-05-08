import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './alerts-page.html',
  styleUrl: './alerts-page.css',
})
export class AlertsPage {

  drawerOpen = false;
  selectedAlert: any = null;

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
    this.drawerOpen = true;
    document.body.classList.add('no-scroll');
  }

  closeDrawer() {
    this.drawerOpen = false;
    document.body.classList.remove('no-scroll');
  }
}
