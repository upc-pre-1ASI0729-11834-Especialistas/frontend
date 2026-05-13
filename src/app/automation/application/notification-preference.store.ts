import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationPreference } from '../domain/model/notification-preference.entity';
import { NotificationPreferencesApi } from '../infrastructure/notification-preference-api';

@Injectable({ providedIn: 'root' })
export class NotificationPreferenceStore {
  private readonly destroyRef = inject(DestroyRef);

  private readonly notificationPreferencesSignal = signal<NotificationPreference[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly notificationPreferences = this.notificationPreferencesSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly notificationPreferencesCount = computed(() => this.notificationPreferences().length);

  constructor(private readonly notificationPreferencesApi: NotificationPreferencesApi) {
    this.loadNotificationPreferences();
  }

  getNotificationPreferenceById(id: number | null | undefined): Signal<NotificationPreference | undefined> {
    return computed(() => id ? this.notificationPreferences().find(e => e.id === id) : undefined);
  }

  private loadNotificationPreferences(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.notificationPreferencesApi.getNotificationPreferences().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.notificationPreferencesSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => this.handleError(err, 'Failed to load notification preferences')
    });
  }

  private handleError(error: any, fallback: string): void {
    this.errorSignal.set(error instanceof Error ? error.message : fallback);
    this.loadingSignal.set(false);
  }
}
