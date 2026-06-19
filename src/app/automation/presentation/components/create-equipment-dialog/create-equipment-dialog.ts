import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EquipmentThreshold } from '../../../domain/model/equipment-threshold.entity';
import { LaboratoryStore } from '../../../../telemetry/application/laboratory.store';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-create-equipment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './create-equipment-dialog.html',
  styleUrl: './create-equipment-dialog.css'
})
export class CreateEquipmentDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<CreateEquipmentDialog>);
  protected readonly laboratoryStore = inject(LaboratoryStore);

  readonly equipmentForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    lab: ['', Validators.required],
    icon: ['kitchen', Validators.required],
    minThreshold: [null],
    maxThreshold: [null],
    warningAt: [null],
    unit: ['°C', Validators.required]
  });

  isEditMode = false;

  readonly iconsList = [
    { value: 'kitchen', label: 'Refrigerator / Freezer' },
    { value: 'biotech', label: 'Incubator / Autoclave' },
    { value: 'device_thermostat', label: 'Chamber / Ambient Temp' },
    { value: 'opacity', label: 'Humidity Regulator' },
    { value: 'bubble_chart', label: 'Gas Monitor' }
  ];

  readonly unitsList = ['°C', '%', 'ppm', 'Pa', 'm/s²'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { equipment?: EquipmentThreshold }
  ) {}

  ngOnInit() {
    if (this.data && this.data.equipment) {
      this.isEditMode = true;
      const eq = this.data.equipment;
      this.equipmentForm.patchValue({
        name: eq.name,
        lab: eq.lab,
        icon: eq.icon || 'kitchen',
        minThreshold: eq.minThreshold,
        maxThreshold: eq.maxThreshold,
        warningAt: eq.warningAt,
        unit: eq.unit || '°C'
      });
    }
  }

  onSubmit() {
    if (this.equipmentForm.valid) {
      this.dialogRef.close(this.equipmentForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
