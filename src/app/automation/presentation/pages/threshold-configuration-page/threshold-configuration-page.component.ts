import { Component, inject, signal, DestroyRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, Observable } from 'rxjs';

import { AutomationStore } from '../../../application/automation.store';
import { ThresholdEquipmentTableComponent } from '../../components/threshold-equipment-table/threshold-equipment-table.component';
import { EquipmentThreshold } from '../../../domain/model/equipment-threshold.entity';

@Component({
  selector: 'app-threshold-configuration-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    ThresholdEquipmentTableComponent
  ],
  templateUrl: './threshold-configuration-page.component.html',
  styleUrl: './threshold-configuration-page.component.css'
})
export class ThresholdConfigurationPageComponent {
  readonly automationStore = inject(AutomationStore);
  private readonly destroyRef = inject(DestroyRef);

  // Card expansion states
  notificationPreferencesExpanded = signal(true);
  usersAccessExpanded = signal(false);

  // Toast notification state
  showSavedToast = signal(false);
  private toastTimeout: any;

  // Mock Form State for Notification Preferences
  alertPrefs = {
    inApp: true,
    email: true,
    sms: true
  };

  quietHours = {
    enabled: true,
    start: '10:00 PM',
    end: '06:00 AM'
  };

  coordinatorPhone = '+1 (555) 000-0000';

  constructor() {
    effect(() => {
      const prefs = this.automationStore.notificationPreferences();
      const settings = this.automationStore.generalSettings();

      if (prefs.length > 0) {
        const inApp = prefs.find(p => p.channel.toLowerCase() === 'in-app');
        const email = prefs.find(p => p.channel.toLowerCase() === 'email');
        const sms = prefs.find(p => p.channel.toLowerCase() === 'sms');

        this.alertPrefs.inApp = inApp ? inApp.isEnabled : true;
        this.alertPrefs.email = email ? email.isEnabled : true;
        this.alertPrefs.sms = sms ? sms.isEnabled : true;
      }

      if (settings.length > 0) {
        const quietEnabled = settings.find(s => s.key === 'quietHoursEnabled');
        const quietStart = settings.find(s => s.key === 'quietHoursStart');
        const quietEnd = settings.find(s => s.key === 'quietHoursEnd');
        const coordPhone = settings.find(s => s.key === 'coordinatorPhone');

        this.quietHours.enabled = quietEnabled ? quietEnabled.value === 'true' : true;
        this.quietHours.start = quietStart ? quietStart.value : '10:00 PM';
        this.quietHours.end = quietEnd ? quietEnd.value : '06:00 AM';
        this.coordinatorPhone = coordPhone ? coordPhone.value : '+1 (555) 000-0000';
      }
    });
  }

  toggleNotificationPreferences(): void {
    this.notificationPreferencesExpanded.update(v => !v);
  }

  toggleUsersAccess(): void {
    this.usersAccessExpanded.update(v => !v);
  }

  onPrefChange(): void {
    const prefs = this.automationStore.notificationPreferences();
    const settings = this.automationStore.generalSettings();

    const inApp = prefs.find(p => p.channel.toLowerCase() === 'in-app');
    const email = prefs.find(p => p.channel.toLowerCase() === 'email');
    const sms = prefs.find(p => p.channel.toLowerCase() === 'sms');

    const quietEnabled = settings.find(s => s.key === 'quietHoursEnabled');
    const quietStart = settings.find(s => s.key === 'quietHoursStart');
    const quietEnd = settings.find(s => s.key === 'quietHoursEnd');
    const coordPhone = settings.find(s => s.key === 'coordinatorPhone');

    const updates$: Observable<any>[] = [];

    if (inApp && inApp.isEnabled !== this.alertPrefs.inApp) {
      updates$.push(this.automationStore.updateNotificationPreference(inApp.id, this.alertPrefs.inApp));
    }
    if (email && email.isEnabled !== this.alertPrefs.email) {
      updates$.push(this.automationStore.updateNotificationPreference(email.id, this.alertPrefs.email));
    }
    if (sms && sms.isEnabled !== this.alertPrefs.sms) {
      updates$.push(this.automationStore.updateNotificationPreference(sms.id, this.alertPrefs.sms));
    }

    const qEnabledStr = this.quietHours.enabled ? 'true' : 'false';
    if (quietEnabled && quietEnabled.value !== qEnabledStr) {
      updates$.push(this.automationStore.updateGeneralSetting(quietEnabled.id, qEnabledStr));
    }
    if (quietStart && quietStart.value !== this.quietHours.start) {
      updates$.push(this.automationStore.updateGeneralSetting(quietStart.id, this.quietHours.start));
    }
    if (quietEnd && quietEnd.value !== this.quietHours.end) {
      updates$.push(this.automationStore.updateGeneralSetting(quietEnd.id, this.quietHours.end));
    }
    if (coordPhone && coordPhone.value !== this.coordinatorPhone) {
      updates$.push(this.automationStore.updateGeneralSetting(coordPhone.id, this.coordinatorPhone));
    }

    if (updates$.length > 0) {
      forkJoin(updates$).subscribe({
        next: () => this.triggerSaveToast(),
        error: (err) => console.error('Failed to auto-save preferences:', err)
      });
    }
  }

  onUpdateThreshold(event: { id: number; changes: any }): void {
    const item = this.automationStore.equipmentThresholds().find(e => e.id === event.id);
    if (item) {
      const min = event.changes.minThreshold !== undefined ? event.changes.minThreshold : item.minThreshold;
      const max = event.changes.maxThreshold !== undefined ? event.changes.maxThreshold : item.maxThreshold;
      const warn = event.changes.warningAt !== undefined ? event.changes.warningAt : item.warningAt;
      const cur = item.currentValue;

      // Status calculation:
      let status = 'normal';
      if (cur < min || cur > max) {
        status = 'critical';
      } else if (cur >= warn) {
        status = 'warning';
      }
      event.changes.status = status;
    }

    this.automationStore.updateEquipmentThreshold(event.id, event.changes)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.triggerSaveToast(),
        error: (err) => console.error('Failed to update equipment threshold:', err)
      });
  }

  onAddEquipment(): void {
    const newId = 0; // Backend generates the ID automatically
    const newEquipment = new EquipmentThreshold({
      id: newId,
      name: `New Incubator ${this.automationStore.equipmentThresholds().length + 1}`,
      lab: 'Bio-Safety Lab 04',
      minThreshold: 10,
      maxThreshold: 45,
      warningAt: 40,
      unit: '°C',
      currentValue: 37.0,
      status: 'normal',
      icon: 'biotech'
    });

    this.automationStore.addEquipmentThreshold(newEquipment)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.triggerSaveToast(),
        error: (err) => console.error('Failed to add equipment threshold:', err)
      });
  }

  private triggerSaveToast(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.showSavedToast.set(true);
    this.toastTimeout = setTimeout(() => {
      this.showSavedToast.set(false);
    }, 3000);
  }
}
