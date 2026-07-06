import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Laboratory } from '../../../../../domain/model/laboratory.entity';
import { LaboratoryStore } from '../../../../../application/laboratory.store';

@Component({
  selector: 'app-lab-notifications-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  templateUrl: './lab-notifications-tab.component.html',
  styleUrls: ['']
})
export class LabNotificationsTabComponent implements OnInit {
  lab = input.required<Laboratory>();
  private readonly laboratoryStore = inject(LaboratoryStore);
  private readonly snackBar = inject(MatSnackBar);

  email = false;
  sms = false;
  push = false;
  criticalOnly = false;
  isSaving = false;

  ngOnInit() {
    const notifs = this.lab().notifications;
    if (notifs) {
      this.email = notifs.email;
      this.sms = notifs.sms;
      this.push = notifs.push;
      this.criticalOnly = notifs.criticalOnly;
    }
  }

  onSave() {
    this.isSaving = true;
    const updatedLab = new Laboratory({
      id: this.lab().id,
      name: this.lab().name,
      type: this.lab().type,
      status: this.lab().status,
      building: this.lab().building,
      floor: this.lab().floor,
      labCode: this.lab().labCode,
      overallStatus: this.lab().overallStatus,
      active: this.lab().active,
      lastUpdate: this.lab().lastUpdate,
      isLive: this.lab().isLive,
      nextMaintenance: this.lab().nextMaintenance,
      maintenanceDaysLeft: this.lab().maintenanceDaysLeft,
      metrics: this.lab().metrics,
      recentAlerts: this.lab().recentAlerts,
      recentActivities: this.lab().recentActivities,
      schedules: this.lab().schedules,
      roomNumber: this.lab().roomNumber,
      description: this.lab().description,
      metricSubscriptions: this.lab().metricSubscriptions,
      notifications: {
        email: this.email,
        sms: this.sms,
        push: this.push,
        criticalOnly: this.criticalOnly
      }
    });

    this.laboratoryStore.updateLaboratory(this.lab().id, updatedLab);
    
    // Simulate slight save duration for premium UX feeling
    setTimeout(() => {
      this.isSaving = false;
      this.snackBar.open('Notification preferences updated successfully!', 'Dismiss', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar']
      });
    }, 600);
  }
}
