import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AutomationStore } from '../../../application/automation.store';
import { UserProfile } from '../../../domain/model/user-profile.entity';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-identity-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  templateUrl: './profile-identity-page.component.html',
  styleUrl: './profile-identity-page.component.css'
})
export class ProfileIdentityPageComponent implements OnInit {
  protected readonly automationStore = inject(AutomationStore);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  profileForm!: FormGroup;

  readonly startTimes = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'
  ];
  readonly durations = [
    '4 Hours', '6 Hours', '8 Hours', '10 Hours', '12 Hours'
  ];

  constructor() {
    this.initForm();

    effect(() => {
      const profile = this.automationStore.currentProfile();
      if (profile) {
        this.profileForm.patchValue({
          fullName: profile.fullName,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          professionalTitle: profile.professionalTitle,
          employeeId: profile.employeeId,
          defaultStartShift: profile.defaultStartShift,
          shiftDuration: profile.shiftDuration,
          autoGenerateShiftReport: profile.autoGenerateShiftReport
        }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {}

  private initForm(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      professionalTitle: [{ value: '', disabled: true }],
      employeeId: [{ value: '', disabled: true }],
      defaultStartShift: ['08:00 AM'],
      shiftDuration: ['8 Hours'],
      autoGenerateShiftReport: [false]
    });
  }

  onSaveChanges(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const currentProfile = this.automationStore.currentProfile();
    if (!currentProfile) {
      this.snackBar.open('No user profile active to update.', 'Close', { duration: 3000 });
      return;
    }

    const formValues = this.profileForm.getRawValue();
    const updatedProfile = new UserProfile({
      id: currentProfile.id,
      fullName: formValues.fullName,
      email: formValues.email,
      role: currentProfile.role,
      avatarUrl: currentProfile.avatarUrl,
      phoneNumber: formValues.phoneNumber,
      professionalTitle: currentProfile.professionalTitle,
      employeeId: currentProfile.employeeId,
      systemState: currentProfile.systemState,
      accessTier: currentProfile.accessTier,
      defaultStartShift: formValues.defaultStartShift,
      shiftDuration: formValues.shiftDuration,
      autoGenerateShiftReport: formValues.autoGenerateShiftReport
    });

    this.automationStore.updateUserProfile(currentProfile.id, updatedProfile).subscribe({
      next: () => {
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
