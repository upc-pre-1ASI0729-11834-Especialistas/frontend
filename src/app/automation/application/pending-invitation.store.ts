import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PendingInvitation } from '../domain/model/pending-invitation.entity';
import { PendingInvitationsApi } from '../infrastructure/pending-invitation-api';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PendingInvitationStore {
  private readonly destroyRef = inject(DestroyRef);

  private readonly pendingInvitationsSignal = signal<PendingInvitation[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly pendingInvitations = this.pendingInvitationsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly pendingInvitationsCount = computed(() => this.pendingInvitations().length);

  constructor(private readonly pendingInvitationsApi: PendingInvitationsApi) {
    this.loadPendingInvitations();
  }

  getPendingInvitationById(id: number | null | undefined): Signal<PendingInvitation | undefined> {
    return computed(() => id ? this.pendingInvitations().find(e => e.id === id) : undefined);
  }

  inviteUser(email: string, role: string): Observable<PendingInvitation> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    const newInvitation = new PendingInvitation({
      id: 0,
      email,
      role,
      sentTimeAgo: 'Just now'
    });
    return this.pendingInvitationsApi.createPendingInvitation(newInvitation).pipe(
      tap({
        next: created => {
          this.pendingInvitationsSignal.update(list => [...list, created]);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.handleError(err, 'Failed to send invitation');
        }
      })
    );
  }

  private loadPendingInvitations(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.pendingInvitationsApi.getPendingInvitations().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.pendingInvitationsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => this.handleError(err, 'Failed to load pending invitations')
    });
  }

  private handleError(error: any, fallback: string): void {
    this.errorSignal.set(error instanceof Error ? error.message : fallback);
    this.loadingSignal.set(false);
  }
}
