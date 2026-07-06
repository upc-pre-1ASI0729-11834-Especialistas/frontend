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
import { AutomationStore } from '../../../application/automation.store';
import { TranslateModule } from '@ngx-translate/core';

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
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './create-sensor-dialog.html',
  styleUrls: ['./create-sensor-dialog.css']
})
export class CreateSensorDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<CreateSensorDialog>);
  protected readonly laboratoryStore = inject(LaboratoryStore);
  protected readonly automationStore = inject(AutomationStore);

  readonly sensorForm: FormGroup = this.fb.group({
    sensorName: ['', Validators.required],
    type: ['', Validators.required],
    unit: ['', Validators.required],
    isActive: [true],
    laboratoryId: [null, Validators.required],
    targetType: ['ambient'],
    equipmentId: [null],
    minThreshold: [null],
    maxThreshold: [null],
    warningThreshold: [null]
  });

  isEditMode = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { sensor?: SensorConfiguration }
  ) {}

  ngOnInit() {
    if (this.data && this.data.sensor) {
      this.isEditMode = true;
      const sensor = this.data.sensor;
      this.sensorForm.patchValue({
        sensorName: sensor.sensorName,
        type: sensor.type,
        unit: sensor.unit,
        isActive: sensor.isActive,
        laboratoryId: sensor.laboratoryId || null,
        targetType: sensor.equipmentId ? 'equipment' : 'ambient',
        equipmentId: sensor.equipmentId || null,
        minThreshold: sensor.minThreshold !== undefined ? sensor.minThreshold : null,
        maxThreshold: sensor.maxThreshold !== undefined ? sensor.maxThreshold : null,
        warningThreshold: sensor.warningThreshold !== undefined ? sensor.warningThreshold : null
      });
    }

    // Reset equipment if laboratory changes
    this.sensorForm.get('laboratoryId')?.valueChanges.subscribe(() => {
      this.sensorForm.get('equipmentId')?.setValue(null);
    });
  }

  getFilteredEquipment() {
    const labId = this.sensorForm.get('laboratoryId')?.value;
    if (!labId) return [];
    const lab = this.laboratoryStore.laboratories().find(l => l.id === labId);
    if (!lab) return [];
    return this.automationStore.equipmentThresholds().filter(e => e.lab === lab.name);
  }

  onSubmit() {
    if (this.sensorForm.valid) {
      const val = this.sensorForm.value;
      this.dialogRef.close({
        sensorName: val.sensorName,
        type: val.type,
        unit: val.unit,
        isActive: val.isActive,
        laboratoryId: val.laboratoryId,
        equipmentId: val.targetType === 'equipment' ? val.equipmentId : null,
        minThreshold: val.minThreshold,
        maxThreshold: val.maxThreshold,
        warningThreshold: val.warningThreshold
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
