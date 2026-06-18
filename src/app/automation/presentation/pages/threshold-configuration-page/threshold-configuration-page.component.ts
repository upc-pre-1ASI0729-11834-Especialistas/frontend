import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  toggleNotificationPreferences(): void {
    this.notificationPreferencesExpanded.update(v => !v);
  }

  toggleUsersAccess(): void {
    this.usersAccessExpanded.update(v => !v);
  }

  onPrefChange(): void {
    this.triggerSaveToast();
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
    // Adding a new equipment threshold item with defaults for demonstration
    // It's a premium touch to allow adding items, showing they register in mock server.
    const newId = this.automationStore.equipmentThresholds().length + 1;
    const newEquipment = new EquipmentThreshold({
      id: newId,
      name: `New Equipment #${newId}`,
      lab: 'Main Lab',
      minThreshold: 4,
      maxThreshold: 10,
      warningAt: 9,
      unit: '°C',
      currentValue: 6.5,
      status: 'normal',
      icon: 'kitchen'
    });

    // We can simulate adding it locally (or just save to server if api supports create)
    // For now, since our API inherits standard endpoints, we can use create if needed or log it.
    console.log('Adding equipment:', newEquipment);
    this.triggerSaveToast();
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
