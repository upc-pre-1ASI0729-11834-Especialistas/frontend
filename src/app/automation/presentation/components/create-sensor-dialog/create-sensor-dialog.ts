import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SensorConfiguration } from '../../../domain/model/sensor-configuration.entity';
import { LaboratoryStore } from '../../../../telemetry/application/laboratory.store';

@Component({
  selector: 'app-create-sensor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-sensor-dialog.html',
  styleUrl: './create-sensor-dialog.css'
})
export class CreateSensorDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<CreateSensorDialog>);
  protected readonly laboratoryStore = inject(LaboratoryStore);

  readonly sensorForm: FormGroup = this.fb.group({
    sensorName: ['', Validators.required],
    type: ['', Validators.required],
    unit: ['', Validators.required],
    isActive: [true],
    laboratoryId: [null, Validators.required]
  });

  isEditMode = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { sensor?: SensorConfiguration }
  ) {}

  ngOnInit() {
    if (this.data && this.data.sensor) {
      this.isEditMode = true;
      this.sensorForm.patchValue({
        sensorName: this.data.sensor.sensorName,
        type: this.data.sensor.type,
        unit: this.data.sensor.unit,
        isActive: this.data.sensor.isActive,
        laboratoryId: this.data.sensor.laboratoryId || null
      });
    }
  }

  onSubmit() {
    if (this.sensorForm.valid) {
      this.dialogRef.close(this.sensorForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
