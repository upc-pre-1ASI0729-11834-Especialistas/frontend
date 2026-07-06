import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LabUser } from '../domain/model/lab-user.entity';
import { LabUsersApi } from '../infrastructure/lab-user-api';

@Injectable({ providedIn: 'root' })
export class LabUserStore {
  private readonly destroyRef = inject(DestroyRef);

  private readonly labUsersSignal = signal<LabUser[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly labUsers = this.labUsersSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly labUsersCount = computed(() => this.labUsers().length);
  readonly activeUsersCount = computed(() => this.labUsers().filter(u => u.status === 'Active').length);

  constructor(private readonly labUsersApi: LabUsersApi) {}

  getLabUserById(id: number | null | undefined): Signal<LabUser | undefined> {
    return computed(() => id ? this.labUsers().find(e => e.id === id) : undefined);
  }

  loadLabUsers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.labUsersApi.getLabUsers().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.labUsersSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => this.handleError(err, 'Failed to load lab users')
    });
  }

  private handleError(error: any, fallback: string): void {
    this.errorSignal.set(error instanceof Error ? error.message : fallback);
    this.loadingSignal.set(false);
  }
}
