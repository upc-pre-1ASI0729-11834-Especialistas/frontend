import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AutomationStore } from '../../../application/automation.store';
import { AuthStore } from '../../../../iam/application/auth.store';

@Component({
  selector: 'app-security-access-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './security-access-page.component.html',
  styleUrl: './security-access-page.component.css'
})
export class SecurityAccessPageComponent implements OnInit {
  protected readonly automationStore = inject(AutomationStore);
  protected readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  passwordForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onUpdatePassword(): void {
    if (this.passwordForm.invalid) {
      this.snackBar.open('Please fill out the form correctly. Passwords must match and be at least 8 characters.', 'Close', { duration: 3000 });
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;
    this.authStore.updatePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.snackBar.open('Password updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        this.passwordForm.reset();
      },
      error: (err) => {
        console.error('Failed to update password:', err);
        const errorMsg = err.status === 400 ? 'Incorrect current password.' : 'Failed to update password. Please try again.';
        this.snackBar.open(errorMsg, 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  onEnable2FA(): void {
    this.snackBar.open('Two-Factor Authentication configuration initiated!', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
