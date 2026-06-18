import { Component, inject, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EscalateSupervisorDialog } from '../escalate-dialog/escalate-supervisor-dialog';
import { AlertsStore } from '../../../application/alerts.store';

@Component({
  selector: 'app-incident-view-page',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatDialogModule, CommonModule],
  templateUrl: './incident-view-page.html',
  styleUrl: './incident-view-page.css',
})
export class IncidentViewPage {
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly alertsStore = inject(AlertsStore);

  readonly alertId = signal<number | null>(null);

  readonly alert = computed(() => {
    const id = this.alertId();
    return id ? this.alertsStore.getAlertById(id)() : undefined;
  });

  readonly affectedEquipment = computed(() => {
    const currentAlert = this.alert();
    if (!currentAlert) return 'Refrigerator B2';
    const title = currentAlert.title.toLowerCase();
    if (title.includes('co2')) return 'CO2 Monitor CM-01';
    if (title.includes('freezer')) return 'ULT Freezer F-07';
    if (title.includes('humidity')) return 'HVAC Unit 3';
    return 'Refrigerator B2';
  });

  readonly sensorId = computed(() => {
    const currentAlert = this.alert();
    if (!currentAlert) return 'Sensor T-B2-01';
    const desc = currentAlert.description || '';
    const match = desc.match(/Sensor\s+[\w\-]+/i);
    return match ? match[0] : 'Sensor T-01';
  });

  readonly location = computed(() => {
    const currentAlert = this.alert();
    if (!currentAlert) return 'Building C - Level 1';
    const desc = currentAlert.description.toLowerCase();
    if (desc.includes('lab a')) return 'Lab A - Building A';
    if (desc.includes('lab d')) return 'Lab D - Building D';
    if (desc.includes('lab c')) return 'Lab C - Building C';
    return 'Building C - Level 1';
  });

  readonly currentValue = computed(() => {
    const currentAlert = this.alert();
    if (!currentAlert) return '9.4°C';
    const desc = currentAlert.description || '';
    const match = desc.match(/[\d\.]+\s*(°C|ppm|%)/i);
    return match ? match[0] : 'Normal';
  });

  constructor() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.alertId.set(Number(id));
      }
    });
  }

  openEscalate(): void {
    const currentAlert = this.alert();
    this.dialog.open(EscalateSupervisorDialog, {
      data: {
        equipmentName: this.affectedEquipment(),
        incidentDescription: currentAlert ? currentAlert.title : 'Temperature Critical'
      }
    });
  }
}
