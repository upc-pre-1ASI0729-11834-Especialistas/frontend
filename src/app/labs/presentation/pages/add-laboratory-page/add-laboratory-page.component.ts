import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LaboratoryStore, LaboratoryFormData } from '../../../application/laboratory.store';
import { Laboratory, LaboratoryType, GasSensitivity, AlertEscalation, SensorConfig, SafetyThresholds, NotificationPreferences } from '../../../domain/model/laboratory.entity';
import { LabGeneralInfoComponent } from './components/lab-general-info/lab-general-info.component';
import { LabNotificationsConfigComponent } from './components/lab-notifications-config/lab-notifications-config.component';
import { LabSuccessCardComponent } from './components/lab-success-card/lab-success-card.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LabThresholdsConfigComponent } from './components/lab-thresholds-config/lab-thresholds-config.component';
import { LabSensorsConfigComponent } from './components/lab-sensors-config/lab-sensors-config.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-laboratory-page',
  imports: [
    FormsModule,
    LabGeneralInfoComponent,
    LabSensorsConfigComponent,
    LabThresholdsConfigComponent,
    LabNotificationsConfigComponent,
    LabSuccessCardComponent,
  ],
  templateUrl: './add-laboratory-page.component.html',
  styleUrl: './add-laboratory-page.component.css',
})
export class AddLaboratoryPageComponent {
  protected readonly laboratoryStore = inject(LaboratoryStore);
  private readonly router = inject(Router);

  formData: LaboratoryFormData = {
    name: '',
    labCode: '',
    type: '',
    building: '',
    floor: '',
    roomNumber: '',
    description: '',
    sensors: {
      temperature: true,
      airQuality: true,
      aiDetection: true,
      ventilation: false,
      airConditioning: false,
      vibration: false,
      lighting: false,
    },
    thresholds: {
      temperatureMin: 15,
      temperatureMax: 30,
      maxCo2Ppm: 1000,
      gasSensitivity: 'Low - General labs',
      maxVibrationLevel: 5.0,
      alertEscalation: 'Immediate - Stop all activity',
    },
    notifications: {
      email: true,
      sms: true,
      push: false,
      criticalOnly: false,
    },
  };

  readonly sensorCards: {
    key: keyof LaboratoryFormData['sensors'];
    label: string;
    description: string;
    icon: string;
    color: string;
  }[] = [
      {
        key: 'temperature',
        label: 'Temperature',
        description: 'Real-time ambient temperature tracking',
        icon: 'thermostat',
        color: 'var(--mat-sys-primary)',
      },
      {
        key: 'airQuality',
        label: 'Air Quality (CO₂)',
        description: 'Monitors CO₂ and air composition levels',
        icon: 'cloud',
        color: 'var(--mat-sys-primary)',
      },
      {
        key: 'aiDetection',
        label: 'AI Detection',
        description: 'Detects unknown elements using AI models',
        icon: 'psychology',
        color: 'var(--mat-sys-primary)',
      },
      {
        key: 'ventilation',
        label: 'Ventilation',
        description: 'Automated ventilation system control',
        icon: 'air',
        color: 'var(--mat-sys-on-surface-variant)',
      },
      {
        key: 'airConditioning',
        label: 'Air Conditioning',
        description: 'Climate control and cooling management',
        icon: 'ac_unit',
        color: 'var(--mat-sys-on-surface-variant)',
      },
      {
        key: 'vibration',
        label: 'Vibration',
        description: 'Seismic and mechanical vibration sensor',
        icon: 'graphic_eq',
        color: 'var(--mat-sys-on-surface-variant)',
      },
      {
        key: 'lighting',
        label: 'Lighting',
        description: 'Automated smart lighting control system',
        icon: 'lightbulb',
        color: 'var(--mat-sys-on-surface-variant)',
      },
    ];

  ngOnInit(): void {
    this.laboratoryStore.resetCreationState();
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
      sensors: { ...this.formData.sensors },
      thresholds: {
        ...this.formData.thresholds,
        gasSensitivity: this.formData.thresholds.gasSensitivity as GasSensitivity,
        alertEscalation: this.formData.thresholds.alertEscalation as AlertEscalation
      },
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
      sensors: {
        temperature: true,
        airQuality: true,
        aiDetection: true,
        ventilation: false,
        airConditioning: false,
        vibration: false,
        lighting: false,
      },
      thresholds: {
        temperatureMin: 15,
        temperatureMax: 30,
        maxCo2Ppm: 1000,
        gasSensitivity: 'Low - General labs',
        maxVibrationLevel: 5.0,
        alertEscalation: 'Immediate - Stop all activity',
      },
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

