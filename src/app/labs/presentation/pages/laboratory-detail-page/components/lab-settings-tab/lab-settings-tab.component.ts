import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Laboratory, LaboratoryType } from '../../../../../domain/model/laboratory.entity';
import { LaboratoryStore } from '../../../../../application/laboratory.store';

@Component({
  selector: 'app-lab-settings-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './lab-settings-tab.component.html',
  styleUrls: ['./lab-settings-tab.component.css']
})
export class LabSettingsTabComponent implements OnInit {
  lab = input.required<Laboratory>();
  private readonly fb = inject(FormBuilder);
  private readonly laboratoryStore = inject(LaboratoryStore);
  private readonly snackBar = inject(MatSnackBar);

  settingsForm!: FormGroup;
  isSaving = false;

  readonly labTypes: LaboratoryType[] = [
    'Biological Safety',
    'Chemical Synthesis',
    'Cryogenic Storage',
    'Clean Room ISO 5',
    'Material Science',
    'Analytical',
    'Radiation Controlled',
    'Molecular Biology',
    'Environmental',
    'Biohazard Level 2',
    'Biohazard Level 3'
  ];

  ngOnInit() {
    this.settingsForm = this.fb.group({
      name: [this.lab().name, Validators.required],
      labCode: [this.lab().labCode, Validators.required],
      type: [this.lab().type, Validators.required],
      building: [this.lab().building, Validators.required],
      floor: [this.lab().floor, Validators.required],
      roomNumber: [this.lab().roomNumber || ''],
      description: [this.lab().description || '']
    });
  }

  onSubmit() {
    if (this.settingsForm.invalid) return;

    this.isSaving = true;
    const formVal = this.settingsForm.value;

    const updatedLab = new Laboratory({
      id: this.lab().id,
      name: formVal.name,
      type: formVal.type,
      status: this.lab().status,
      building: formVal.building,
      floor: formVal.floor,
      labCode: formVal.labCode,
      overallStatus: this.lab().overallStatus,
      active: this.lab().active,
      lastUpdate: new Date().toISOString(),
      isLive: this.lab().isLive,
      nextMaintenance: this.lab().nextMaintenance,
      maintenanceDaysLeft: this.lab().maintenanceDaysLeft,
      metrics: this.lab().metrics,
      recentAlerts: this.lab().recentAlerts,
      recentActivities: this.lab().recentActivities,
      schedules: this.lab().schedules,
      roomNumber: formVal.roomNumber,
      description: formVal.description,
      metricSubscriptions: this.lab().metricSubscriptions,
      notifications: this.lab().notifications
    });

    this.laboratoryStore.updateLaboratory(this.lab().id, updatedLab);

    setTimeout(() => {
      this.isSaving = false;
      this.snackBar.open('Laboratory settings updated successfully!', 'Dismiss', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }, 600);
  }
}
