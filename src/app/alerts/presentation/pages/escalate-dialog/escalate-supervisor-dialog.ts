import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

export interface EscalateDialogData {
  equipmentName: string;
  incidentDescription: string;
}

@Component({
  selector: 'app-escalate-supervisor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './escalate-supervisor-dialog.html',
  styleUrl: './escalate-supervisor-dialog.css'
})
export class EscalateSupervisorDialog {
  readonly reasons = [
    'Temperature threshold exceeded',
    'Equipment malfunction',
    'Contamination risk',
    'Power failure',
    'Sensor error',
    'Other'
  ];

  selectedReason = signal('');
  message = signal('');
  notifyEmail = signal(true);
  notifyInApp = signal(true);

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: EscalateDialogData,
    private readonly dialogRef: MatDialogRef<EscalateSupervisorDialog>
  ) {}

  toggleEmail(): void {
    this.notifyEmail.set(!this.notifyEmail());
  }

  toggleInApp(): void {
    this.notifyInApp.set(!this.notifyInApp());
  }

  send(): void {
    this.dialogRef.close({
      reason: this.selectedReason(),
      message: this.message(),
      notifyEmail: this.notifyEmail(),
      notifyInApp: this.notifyInApp()
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
