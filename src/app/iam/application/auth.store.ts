import { inject, Injectable, signal, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize } from 'rxjs/operators';
import { of, timeout } from 'rxjs';
import { AuthenticatedUser } from '../domain/model/authenticated-user.entity';
import { AuthenticationPort } from '../domain/ports/authentication.port';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private readonly authPort = inject(AuthenticationPort);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly currentUserSignal = signal<AuthenticatedUser | null>(null);
  private readonly isAuthenticatedSignal = signal<boolean>(false);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    this.checkStoredSession();
  }

  signIn(email: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.authPort.signIn(email, password).pipe(
      timeout(10000),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: (user) => {
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Sign-in failed:', err);
        let errorMsg = 'Invalid credentials. Please try again.';
        if (err.name === 'TimeoutError') {
          errorMsg = 'Connection timed out. Please try again.';
        } else if (err.status === 400 || err.status === 401) {
          errorMsg = 'Incorrect email/username or password.';
        } else if (err.status === 403 && err.error?.message === 'ACCOUNT_NOT_CONFIRMED') {
          errorMsg = 'Your account is not confirmed yet. Redirecting to verification...';
          this.router.navigate(['/confirm-account'], { queryParams: { email } });
        } else if (err.status === 0) {
          errorMsg = 'Cannot connect to the authorization server.';
        }
        this.errorSignal.set(errorMsg);
      }
    });
  }

  signUp(email: string, password: string, fullName: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.authPort.signUp(email, password, fullName).pipe(
      timeout(10000),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: () => {
        this.router.navigate(['/confirm-account'], { queryParams: { email } });
      },
      error: (err) => {
        console.error('Sign-up failed:', err);
        let errorMsg = 'Failed to register account. Please try again.';
        if (err.name === 'TimeoutError') {
          errorMsg = 'Connection timed out. Please try again.';
        } else if (err.status === 400) {
          if (err.error?.message === 'EMAIL_ALREADY_EXISTS_UNCONFIRMED') {
            errorMsg = 'This email is already registered but unconfirmed. Redirecting to verification...';
            setTimeout(() => {
              this.router.navigate(['/confirm-account'], { queryParams: { email } });
            }, 3000);
          } else if (err.error?.message === 'EMAIL_ALREADY_EXISTS') {
            errorMsg = 'This email is already registered. Please sign in instead.';
          } else {
            errorMsg = err.error?.message || 'Email already registered or invalid invitation.';
          }
        } else if (err.status === 0) {
          errorMsg = 'Cannot connect to the authorization server.';
        }
        this.errorSignal.set(errorMsg);
      }
    });
  }

  cleanTestUsers(onSuccess: () => void): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.authPort.cleanTestUsers().pipe(
      timeout(10000),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: () => {
        onSuccess();
      },
      error: (err) => {
        console.error('Failed to clean test users:', err);
        this.errorSignal.set('Failed to clear test users. Please try again.');
      }
    });
  }

  confirmAccount(email: string, code: string, onSuccess: () => void): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.authPort.confirmAccount(email, code).pipe(
      timeout(10000),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: () => {
        onSuccess();
      },
      error: (err) => {
        console.error('Confirmation failed:', err);
        let errorMsg = 'Invalid verification code. Please try again.';
        if (err.name === 'TimeoutError') {
          errorMsg = 'Connection timed out. Please try again.';
        } else if (err.status === 400) {
          errorMsg = err.error?.message || 'Invalid or expired confirmation code.';
        } else if (err.status === 0) {
          errorMsg = 'Cannot connect to the authorization server.';
        }
        this.errorSignal.set(errorMsg);
      }
    });
  }

  resendCode(email: string, onSuccess: () => void): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.authPort.resendCode(email).pipe(
      timeout(10000),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: () => {
        onSuccess();
      },
      error: (err) => {
        console.error('Resending verification code failed:', err);
        let errorMsg = 'Failed to resend verification code. Please try again.';
        if (err.name === 'TimeoutError') {
          errorMsg = 'Connection timed out. Please try again.';
        } else if (err.status === 0) {
          errorMsg = 'Cannot connect to the authorization server.';
        }
        this.errorSignal.set(errorMsg);
      }
    });
  }

  signOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/login']);
  }

  checkStoredSession(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const userObj = JSON.parse(userStr);
        // Map to instance of AuthenticatedUser
        const user = new AuthenticatedUser(userObj.id, userObj.email, userObj.fullName, userObj.token);
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      } catch (e) {
        this.signOut();
      }
    }
  }

  updatePassword(currentPassword: string, newPassword: string) {
    return this.authPort.updatePassword(currentPassword, newPassword);
  }

  updateCurrentUserDetails(email: string, fullName: string): void {
    const user = this.currentUserSignal();
    if (user) {
      const updatedUser = new AuthenticatedUser(user.id, email, fullName, user.token);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.currentUserSignal.set(updatedUser);
    }
  }
}
