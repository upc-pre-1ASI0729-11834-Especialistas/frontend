import { inject, Injectable, signal, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
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
        if (err.status === 400 || err.status === 401) {
          errorMsg = 'Incorrect email/username or password.';
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
