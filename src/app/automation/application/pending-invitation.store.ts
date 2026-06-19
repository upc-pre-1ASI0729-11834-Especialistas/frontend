import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PendingInvitation } from '../domain/model/pending-invitation.entity';
import { PendingInvitationsApi } from '../infrastructure/pending-invitation-api';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { WorkspaceStore } from '../../shared/application/workspace.store';

@Injectable({ providedIn: 'root' })
export class PendingInvitationStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly workspaceStore = inject(WorkspaceStore);

  private readonly pendingInvitationsSignal = signal<PendingInvitation[]>([]);
  private readonly receivedInvitationsSignal = signal<PendingInvitation[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly pendingInvitations = this.pendingInvitationsSignal.asReadonly();
  readonly receivedInvitations = this.receivedInvitationsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly pendingInvitationsCount = computed(() => this.pendingInvitations().length);
  readonly receivedInvitationsCount = computed(() => this.receivedInvitations().length);

  constructor(private readonly pendingInvitationsApi: PendingInvitationsApi) {
    this.loadPendingInvitations();
    this.loadReceivedInvitations();
  }

  getPendingInvitationById(id: number | null | undefined): Signal<PendingInvitation | undefined> {
    return computed(() => id ? this.pendingInvitations().find(e => e.id === id) : undefined);
  }

  inviteUser(email: string, role: string, laboratoryIds: number[]): Observable<PendingInvitation> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    const newInvitation = new PendingInvitation({
      id: 0,
      email,
      role,
      sentTimeAgo: 'Just now',
      laboratoryIds
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

  cancelInvitation(id: number): Observable<void> {
    this.loadingSignal.set(true);
    return this.pendingInvitationsApi.deletePendingInvitation(id).pipe(
      tap({
        next: () => {
          this.pendingInvitationsSignal.update(list => list.filter(i => i.id !== id));
          this.loadingSignal.set(false);
        },
        error: err => {
          this.handleError(err, 'Failed to cancel invitation');
        }
      })
    );
  }

  resendInvitation(id: number): Observable<PendingInvitation> {
    this.loadingSignal.set(true);
    return this.pendingInvitationsApi.resendPendingInvitation(id).pipe(
      tap({
        next: updated => {
          this.pendingInvitationsSignal.update(list => list.map(i => i.id === id ? updated : i));
          this.loadingSignal.set(false);
        },
        error: err => {
          this.handleError(err, 'Failed to resend invitation');
        }
      })
    );
  }

  loadReceivedInvitations(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.pendingInvitationsApi.getMyInvitations().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.receivedInvitationsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => this.handleError(err, 'Failed to load received invitations')
    });
  }

  acceptInvitation(id: number): Observable<void> {
    this.loadingSignal.set(true);
    return this.pendingInvitationsApi.acceptInvitation(id).pipe(
      tap({
        next: () => {
          this.receivedInvitationsSignal.update(list => list.filter(i => i.id !== id));
          this.loadingSignal.set(false);
          // Refresh workspaces list
          this.workspaceStore.loadWorkspaces();
        },
        error: err => {
          this.handleError(err, 'Failed to accept invitation');
        }
      })
    );
  }

  rejectInvitation(id: number): Observable<void> {
    this.loadingSignal.set(true);
    return this.pendingInvitationsApi.rejectInvitation(id).pipe(
      tap({
        next: () => {
          this.receivedInvitationsSignal.update(list => list.filter(i => i.id !== id));
          this.loadingSignal.set(false);
        },
        error: err => {
          this.handleError(err, 'Failed to reject invitation');
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
