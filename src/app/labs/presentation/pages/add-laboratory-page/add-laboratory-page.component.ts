import { Component, inject, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);

  isEditMode = false;
  laboratoryId: number | null = null;

  formData: LaboratoryFormData = {
    name: '',
    labCode: '',
    type: '',
    building: '',
    floor: '',
    roomNumber: '',
    description: '',
    nextMaintenance: new Date(),
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

    effect(() => {
      if (this.isEditMode) {
        const lab = this.laboratoryStore.selectedLaboratory();
        if (lab && lab.id === this.laboratoryId) {
          this.formData.name = lab.name;
          this.formData.labCode = lab.labCode;
          this.formData.type = lab.type;
          this.formData.building = lab.building;
          this.formData.floor = lab.floor;
          this.formData.roomNumber = lab.roomNumber || '';
          this.formData.description = lab.description || '';
          
          if (lab.nextMaintenance) {
            const parts = lab.nextMaintenance.split('-');
            if (parts.length === 3) {
              this.formData.nextMaintenance = new Date(
                parseInt(parts[0], 10),
                parseInt(parts[1], 10) - 1,
                parseInt(parts[2], 10)
              );
            } else {
              this.formData.nextMaintenance = lab.nextMaintenance;
            }
          } else {
            this.formData.nextMaintenance = new Date();
          }

          if (lab.notifications) {
            this.formData.notifications = { ...lab.notifications };
          }
          
          const activeTypes = this.metricTypeStore.activeMetricTypes();
          if (activeTypes.length > 0) {
            this.formData.metricSubscriptions = activeTypes.map(mt => {
              const sub = lab.metricSubscriptions.find(s => s.metricTypeId === mt.id);
              return {
                metricTypeId: mt.id,
                metricTypeKey: mt.key,
                metricTypeDisplayName: mt.displayName,
                metricTypeIcon: mt.icon,
                metricTypeUnit: mt.unit,
                metricTypeCategory: mt.category,
                minThreshold: sub?.minThreshold,
                maxThreshold: sub?.maxThreshold,
                enabled: !!sub && sub.active
              };
            });
          }
        }
      }
    });

    effect(() => {
      if (this.laboratoryStore.creationSuccess()) {
        if (this.isEditMode) {
          this.laboratoryStore.resetCreationState();
          this.router.navigate(['/laboratories', this.laboratoryId]);
        }
      }
    });
  }

  ngOnInit(): void {
    this.laboratoryStore.resetCreationState();
    this.metricTypeStore.loadActive();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.laboratoryId = parseInt(idParam, 10);
      this.laboratoryStore.loadLaboratoryById(this.laboratoryId);
    }
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

    const originalLab = this.isEditMode ? this.laboratoryStore.selectedLaboratory() : null;

    const formatMaintenanceDate = (d: any): string => {
      if (!d) return new Date().toISOString().split('T')[0];
      if (typeof d === 'string' && d.includes('-')) {
        return d;
      }
      const date = new Date(d);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const lab = new Laboratory({
      id: this.isEditMode ? this.laboratoryId! : 0,
      name: this.formData.name,
      type: this.formData.type as LaboratoryType,
      status: originalLab ? originalLab.status : 'Operational',
      building: this.formData.building,
      floor: this.formData.floor,
      labCode: this.formData.labCode,
      overallStatus: originalLab ? originalLab.overallStatus : 'Operational',
      active: originalLab ? originalLab.active : true,
      lastUpdate: originalLab ? originalLab.lastUpdate : 'Just now',
      isLive: originalLab ? originalLab.isLive : true,
      nextMaintenance: formatMaintenanceDate(this.formData.nextMaintenance),
      maintenanceDaysLeft: originalLab ? originalLab.maintenanceDaysLeft : 30,
      metrics: originalLab ? originalLab.metrics : [],
      recentAlerts: originalLab ? originalLab.recentAlerts : [],
      recentActivities: originalLab ? originalLab.recentActivities : [],
      schedules: originalLab ? originalLab.schedules : [],
      roomNumber: this.formData.roomNumber,
      description: this.formData.description,
      metricSubscriptions: selectedSubs,
      notifications: { ...this.formData.notifications }
    });

    if (this.isEditMode) {
      this.laboratoryStore.updateLaboratory(this.laboratoryId!, lab);
    } else {
      this.laboratoryStore.createLaboratory(lab);
    }
  }

  onCancel(): void {
    if (this.isEditMode) {
      this.router.navigate(['/laboratories', this.laboratoryId]);
    } else {
      this.router.navigate(['/laboratories']);
    }
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
      nextMaintenance: new Date(),
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

