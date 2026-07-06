import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AutomationStore } from '../../../application/automation.store';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-alerts-notifications-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './alerts-notifications-page.component.html',
  styleUrls: ['']
})
export class AlertsNotificationsPageComponent implements OnInit {
  protected readonly automationStore = inject(AutomationStore);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  notificationForm!: FormGroup;

  constructor() {
    effect(() => {
      const prefs = this.automationStore.notificationPreferences();
      const settings = this.automationStore.generalSettings();

      if (prefs.length > 0 && settings.length > 0) {
        const emailPref = prefs.find(p => p.channel.toLowerCase() === 'email');
        const inAppPref = prefs.find(p => p.channel.toLowerCase() === 'in-app');

        const dailySum = settings.find(s => s.key === 'dailySummary');
        const weeklyRep = settings.find(s => s.key === 'weeklyReport');
        const instantAlert = settings.find(s => s.key === 'instantSensorAlerts');

        this.notificationForm.patchValue({
          emailNotifications: emailPref ? emailPref.isEnabled : true,
          inAppNotifications: inAppPref ? inAppPref.isEnabled : false,
          dailySummary: dailySum ? dailySum.value === 'true' : false,
          weeklyReport: weeklyRep ? weeklyRep.value === 'true' : false,
          instantSensorAlerts: instantAlert ? instantAlert.value === 'true' : true
        }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      inAppNotifications: [false],
      dailySummary: [false],
      weeklyReport: [false],
      instantSensorAlerts: [true]
    });
  }

  onSaveChanges(): void {
    const formValue = this.notificationForm.value;
    const prefs = this.automationStore.notificationPreferences();
    const settings = this.automationStore.generalSettings();

    const emailPref = prefs.find(p => p.channel.toLowerCase() === 'email');
    const inAppPref = prefs.find(p => p.channel.toLowerCase() === 'in-app');

    const dailySum = settings.find(s => s.key === 'dailySummary');
    const weeklyRep = settings.find(s => s.key === 'weeklyReport');
    const instantAlert = settings.find(s => s.key === 'instantSensorAlerts');

    const updates$: Observable<any>[] = [];

    if (emailPref && emailPref.isEnabled !== formValue.emailNotifications) {
      updates$.push(this.automationStore.updateNotificationPreference(emailPref.id, formValue.emailNotifications));
    }
    if (inAppPref && inAppPref.isEnabled !== formValue.inAppNotifications) {
      updates$.push(this.automationStore.updateNotificationPreference(inAppPref.id, formValue.inAppNotifications));
    }
    const dailySummaryStr = formValue.dailySummary ? 'true' : 'false';
    if (dailySum && dailySum.value !== dailySummaryStr) {
      updates$.push(this.automationStore.updateGeneralSetting(dailySum.id, dailySummaryStr));
    }
    const weeklyReportStr = formValue.weeklyReport ? 'true' : 'false';
    if (weeklyRep && weeklyRep.value !== weeklyReportStr) {
      updates$.push(this.automationStore.updateGeneralSetting(weeklyRep.id, weeklyReportStr));
    }
    const instantAlertStr = formValue.instantSensorAlerts ? 'true' : 'false';
    if (instantAlert && instantAlert.value !== instantAlertStr) {
      updates$.push(this.automationStore.updateGeneralSetting(instantAlert.id, instantAlertStr));
    }

    if (updates$.length > 0) {
      forkJoin(updates$).subscribe({
        next: () => {
          this.snackBar.open('Notification preferences saved successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        },
        error: (err) => {
          console.error('Error saving settings:', err);
          this.snackBar.open('Failed to save settings. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
      });
    } else {
      this.snackBar.open('No changes detected.', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }
  }
}
