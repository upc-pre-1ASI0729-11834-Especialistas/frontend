import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MetricType } from '../../../../telemetry/domain/model/metric-type.entity';

@Component({
  selector: 'app-create-metric-type-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-metric-type-dialog.html',
  styleUrl: './create-metric-type-dialog.css'
})
export class CreateMetricTypeDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<CreateMetricTypeDialog>);

  readonly metricTypeForm: FormGroup = this.fb.group({
    key: ['', [Validators.required, Validators.pattern(/^[a-z0-9_]+$/)]],
    displayName: ['', Validators.required],
    unit: ['', Validators.required],
    icon: ['', Validators.required],
    category: ['ENVIRONMENTAL', Validators.required],
    active: [true]
  });

  isEditMode = false;
  categories = ['ENVIRONMENTAL', 'SAFETY', 'EQUIPMENT'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { metricType?: MetricType }
  ) {}

  ngOnInit() {
    if (this.data && this.data.metricType) {
      this.isEditMode = true;
      this.metricTypeForm.patchValue({
        key: this.data.metricType.key,
        displayName: this.data.metricType.displayName,
        unit: this.data.metricType.unit,
        icon: this.data.metricType.icon,
        category: this.data.metricType.category || 'ENVIRONMENTAL',
        active: this.data.metricType.active
      });
      this.metricTypeForm.get('key')?.disable();
    }
  }

  onSubmit() {
    if (this.metricTypeForm.valid) {
      this.dialogRef.close(this.metricTypeForm.getRawValue());
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
