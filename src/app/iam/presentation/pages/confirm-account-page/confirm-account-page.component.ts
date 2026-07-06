import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore } from '../../../application/auth.store';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-account-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './confirm-account-page.component.html',
  styleUrl: './confirm-account-page.component.css',
})
export class ConfirmAccountPageComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  email = '';
  code = '';
  resendSuccess = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  onConfirm(): void {
    if (this.email && this.code) {
      this.authStore.confirmAccount(this.email, this.code, () => {
        this.snackBar.open('Account confirmed successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/login'], { queryParams: { confirmed: 'true' } });
      });
    }
  }

  onResendCode(): void {
    if (this.email) {
      this.authStore.resendCode(this.email, () => {
        this.resendSuccess = true;
        this.snackBar.open('A new code has been sent to your email.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        setTimeout(() => {
          this.resendSuccess = false;
        }, 5000);
      });
    }
  }
}
