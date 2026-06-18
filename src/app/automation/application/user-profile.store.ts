import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserProfile } from '../domain/model/user-profile.entity';
import { UserProfilesApi } from '../infrastructure/user-profile-api';

@Injectable({ providedIn: 'root' })
export class UserProfileStore {
  private readonly destroyRef = inject(DestroyRef);

  private readonly userProfilesSignal = signal<UserProfile[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly userProfiles = this.userProfilesSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  readonly currentProfile = computed(() => this.userProfiles().length > 0 ? this.userProfiles()[0] : undefined);

  constructor(private readonly userProfilesApi: UserProfilesApi) {
    this.loadUserProfiles();
  }

  getUserProfileById(id: number | null | undefined): Signal<UserProfile | undefined> {
    return computed(() => id ? this.userProfiles().find(e => e.id === id) : undefined);
  }

  private loadUserProfiles(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.userProfilesApi.getUserProfiles().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.userProfilesSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => this.handleError(err, 'Failed to load user profiles')
    });
  }

  private handleError(error: any, fallback: string): void {
    this.errorSignal.set(error instanceof Error ? error.message : fallback);
    this.loadingSignal.set(false);
  }
}
