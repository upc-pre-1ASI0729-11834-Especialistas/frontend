import { Component, inject, OnInit, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LaboratoryStore, LaboratoryFormData } from '../../../application/laboratory.store';
import { MetricTypeStore } from '../../../../telemetry/application/metric-type.store';
import { Laboratory, LaboratoryType, NotificationPreferences } from '../../../domain/model/laboratory.entity';
import { LabGeneralInfoComponent } from './components/lab-general-info/lab-general-info.component';
import { LabNotificationsConfigComponent } from './components/lab-notifications-config/lab-notifications-config.component';
import { LabSuccessCardComponent } from './components/lab-success-card/lab-success-card.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LabSensorsConfigComponent } from './components/lab-sensors-config/lab-sensors-config.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-laboratory-page',
  imports: [
    FormsModule,
    RouterLink,
    MatButton,
    MatIcon,
    LabGeneralInfoComponent,
    LabSensorsConfigComponent,
    LabNotificationsConfigComponent,
    LabSuccessCardComponent,
  ],
  templateUrl: './add-laboratory-page.component.html',
  styleUrl: './add-laboratory-page.component.css',
})
export class AddLaboratoryPageComponent implements OnInit {
  protected readonly laboratoryStore = inject(LaboratoryStore);
  protected readonly metricTypeStore = inject(MetricTypeStore);
  private readonly router = inject(Router);

  formData: LaboratoryFormData = {
    name: '',
    labCode: '',
    type: '',
    building: '',
    floor: '',
    roomNumber: '',
    description: '',
    metricSubscriptions: [],
    notifications: {
      email: true,
      sms: true,
      push: false,
      criticalOnly: false,
    },
  };

  constructor() {
    this.initializeMetricSubscriptions();

    effect(() => {
      const activeTypes = this.metricTypeStore.activeMetricTypes();
      if (activeTypes.length > 0 && this.formData.metricSubscriptions.length === 0) {
        this.initializeMetricSubscriptions();
      }
    });
  }

  ngOnInit(): void {
    this.laboratoryStore.resetCreationState();
    this.metricTypeStore.loadActive();
  }

  private initializeMetricSubscriptions(): void {
    const activeTypes = this.metricTypeStore.activeMetricTypes();
    if (activeTypes.length > 0) {
      this.formData.metricSubscriptions = activeTypes.map(mt => ({
        metricTypeId: mt.id,
        metricTypeKey: mt.key,
        metricTypeDisplayName: mt.displayName,
        metricTypeIcon: mt.icon,
        metricTypeUnit: mt.unit,
        metricTypeCategory: mt.category,
        minThreshold: undefined,
        maxThreshold: undefined,
        enabled: false
      }));
    }
  }

  isFormValid(): boolean {
    return (
      this.formData.name.trim().length > 0 &&
      this.formData.labCode.trim().length > 0 &&
      this.formData.type !== ''
    );
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    const selectedSubs = this.formData.metricSubscriptions
      .filter(sub => sub.enabled)
      .map(sub => ({
        metricTypeId: sub.metricTypeId,
        metricTypeKey: sub.metricTypeKey,
        metricTypeDisplayName: sub.metricTypeDisplayName,
        metricTypeIcon: sub.metricTypeIcon,
        metricTypeUnit: sub.metricTypeUnit,
        metricTypeCategory: sub.metricTypeCategory,
        minThreshold: sub.minThreshold,
        maxThreshold: sub.maxThreshold,
        active: true
      }));

    const lab = new Laboratory({
      id: 0,
      name: this.formData.name,
      type: this.formData.type as LaboratoryType,
      status: 'Operational',
      building: this.formData.building,
      floor: this.formData.floor,
      labCode: this.formData.labCode,
      overallStatus: 'Operational',
      active: true,
      lastUpdate: 'Just now',
      isLive: true,
      nextMaintenance: new Date().toISOString().split('T')[0],
      maintenanceDaysLeft: 30,
      metrics: [],
      recentAlerts: [],
      recentActivities: [],
      schedules: [],
      roomNumber: this.formData.roomNumber,
      description: this.formData.description,
      metricSubscriptions: selectedSubs,
      notifications: { ...this.formData.notifications }
    });

    this.laboratoryStore.createLaboratory(lab);
  }

  onCancel(): void {
    this.router.navigate(['/laboratories']);
  }

  onGoToLaboratories(): void {
    this.laboratoryStore.resetCreationState();
    this.router.navigate(['/laboratories']);
  }

  onCreateAnother(): void {
    this.formData = {
      name: '',
      labCode: '',
      type: '',
      building: '',
      floor: '',
      roomNumber: '',
      description: '',
      metricSubscriptions: this.metricTypeStore.activeMetricTypes().map(mt => ({
        metricTypeId: mt.id,
        metricTypeKey: mt.key,
        metricTypeDisplayName: mt.displayName,
        metricTypeIcon: mt.icon,
        metricTypeUnit: mt.unit,
        metricTypeCategory: mt.category,
        minThreshold: undefined,
        maxThreshold: undefined,
        enabled: false
      })),
      notifications: {
        email: true,
        sms: true,
        push: false,
        criticalOnly: false,
      },
    };
    this.laboratoryStore.resetCreationState();
  }
}

