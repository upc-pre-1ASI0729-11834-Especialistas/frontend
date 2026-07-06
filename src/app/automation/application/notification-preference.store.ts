import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
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

  constructor(private readonly notificationPreferencesApi: NotificationPreferencesApi) {}

  getNotificationPreferenceById(id: number | null | undefined): Signal<NotificationPreference | undefined> {
    return computed(() => id ? this.notificationPreferences().find(e => e.id === id) : undefined);
  }

  updateNotificationPreference(id: number, enabled: boolean): Observable<NotificationPreference> {
    this.loadingSignal.set(true);
    const existing = this.notificationPreferencesSignal().find(p => p.id === id);
    if (!existing) {
      throw new Error(`NotificationPreference with id ${id} not found`);
    }

    const updatedEntity = new NotificationPreference({
      id: existing.id,
      channel: existing.channel,
      isEnabled: enabled,
      threshold: existing.threshold,
      description: existing.description
    });

    return this.notificationPreferencesApi.updateNotificationPreference(id, updatedEntity).pipe(
      tap({
        next: saved => {
          this.notificationPreferencesSignal.update(list =>
            list.map(item => item.id === id ? saved : item)
          );
          this.loadingSignal.set(false);
        },
        error: err => {
          this.handleError(err, 'Failed to update notification preference');
        }
      })
    );
  }

  loadNotificationPreferences(): void {
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
