import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SensorConfiguration } from '../../../domain/model/sensor-configuration.entity';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-calibrate-sensor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './calibrate-sensor-dialog.html',
  styleUrl: './calibrate-sensor-dialog.css'
})
export class CalibrateSensorDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<CalibrateSensorDialog>);

  readonly calibrateForm: FormGroup = this.fb.group({
    certificateId: ['', Validators.required],
    calibratedAt: [new Date().toISOString().substring(0, 10), Validators.required],
    expirationDate: [new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), Validators.required]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { sensor: SensorConfiguration }
  ) {}

  ngOnInit() {}

  onSubmit() {
    if (this.calibrateForm.valid) {
      this.dialogRef.close(this.calibrateForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
