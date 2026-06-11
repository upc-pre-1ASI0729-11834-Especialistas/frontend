import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface Alert {
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
  // severity code used for logic; display labels are translated in template
  severity: 'critical' | 'warning' | 'resolvedToday';
  count: number;
  colorClass: string;
  pillClass: string;
  items: Alert[];
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
  private router = inject(Router);

  summaryCards = [
    { title: 'alerts.summary.critical', subtitle: 'alerts.summary.alerts', value: 3, class: 'card-critical' },
    { title: 'alerts.summary.warning', subtitle: 'alerts.summary.alerts', value: 5, class: 'card-warning' },
    { title: 'alerts.summary.informational', subtitle: 'alerts.summary.alerts', value: 12, class: 'card-info' },
    { title: 'alerts.summary.resolvedToday', subtitle: 'alerts.summary.alerts', value: 24, class: 'card-resolved' }
  ];

  alertGroups: AlertGroup[] = [
    {
      severity: 'critical',
      count: 3,
      colorClass: 'text-red',
      pillClass: 'pill-critical',
      items: [
        {
          title: 'Temperature threshold exceeded',
          location: 'Cryo Storage 01 — Refrigerator B2',
          timeAgo: '38 min ago',
          sensor: 'Sensor T-B2-01',
          description: 'Temperature reading of 9.4°C exceeded the safe threshold of 8.0°C. Sample integrity may be at risk.',
          duration: '38 min'
        },
        {
          title: 'CO2 level above safe limit',
          location: 'Lab A — CO2 Monitor CM-01',
          timeAgo: '1 hr ago',
          sensor: 'Sensor CO2-A-01',
          description: 'CO2 concentration at 1,850 ppm — exceeds regulatory limit of 1,000 ppm. Ventilation check required.',
          duration: '1 hr 4 min'
        },
        {
          title: 'Freezer door ajar — sample exposure risk',
          location: 'Lab D — ULT Freezer F-07',
          timeAgo: '2 hr ago',
          sensor: 'Door sensor DS-F07',
          description: 'Door open status detected for over 4 minutes. Internal temperature rising. Samples flagged for review.',
          duration: '2 hr 11 min'
        }
      ]
    },
    {
      severity: 'warning',
      count: 5,
      colorClass: 'text-orange',
      pillClass: 'pill-warning',
      items: [
        {
          title: 'Humidity above optimal threshold',
          location: 'Lab C — HVAC Unit 3',
          timeAgo: '1 hr ago',
          sensor: 'Sensor HU-C3-02',
          description: 'Relative humidity at 68% — above the optimal ceiling of 60%. Monitor closely for condensation risk.',
          duration: '1 hr 2 min'
        },
        {
          title: 'Refrigerator A1 temperature trending high',
          location: 'Lab A — Refrigerator A1',
          timeAgo: '3 hr ago',
          sensor: 'Sensor T-A1-01',
          description: 'Temperature trending toward 7.8°C (threshold: 8.0°C). No breach yet — preventive review recommended.',
          duration: '3 hr 18 min'
        }
      ]
    },
    {
      severity: 'resolvedToday',
      count: 24,
      colorClass: 'text-green',
      pillClass: 'pill-resolved',
      items: [
        {
          title: 'Incubator D1 temperature spike',
          location: 'Lab D — Incubator D1',
          timeAgo: '5 hr ago',
          sensor: 'Sensor T-D1-01',
          description: 'Brief spike to 38.4°C detected. Auto-recovery confirmed. Temperature returned to 37.0°C within 6 minutes.',
          duration: '6 min',
          resolvedBy: 'Resolved by Dr. Vance · 5h ago'
        },
        {
          title: 'Power interruption — UPS switchover',
          location: 'Building C — Power Monitor',
          timeAgo: 'Yesterday · 11:32 PM',
          sensor: '',
          description: 'Momentary grid power loss. UPS engaged successfully. All equipment remained operational throughout.',
          duration: '2 min',
          resolvedBy: 'Resolved by System Auto-resolved · 8h ago'
        }
      ]
    }
  ];

  navigateToIncident() {
    this.router.navigate(['/alerts/incident']);
  }

  currentTime = new Date();

  get totalAlerts(): number {
    return this.alertGroups.reduce((sum, g) => sum + g.count, 0);
  }
}
