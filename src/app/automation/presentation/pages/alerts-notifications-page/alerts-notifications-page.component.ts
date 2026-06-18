import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AutomationStore } from '../../../application/automation.store';

@Component({
  selector: 'app-alerts-notifications-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './alerts-notifications-page.component.html',
  styleUrl: './alerts-notifications-page.component.css'
})
export class AlertsNotificationsPageComponent implements OnInit {
  protected readonly automationStore = inject(AutomationStore);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  notificationForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      inAppNotifications: [false],
      tempWarningLevel: ['2c'],
      tempCriticalLevel: ['5c'],
      dailySummary: [false],
      weeklyReport: [false],
      instantSensorAlerts: [true]
    });
  }

  onSaveChanges(): void {
    this.snackBar.open('Notification preferences saved successfully!', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
