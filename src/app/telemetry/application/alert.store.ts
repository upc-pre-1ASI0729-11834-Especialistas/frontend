import { AlertApi } from '../infrastructure/alert-api';
import { Alert } from '../domain/model/alert.entity';
import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AlertStore {
  private readonly alertsSignal = signal<Alert[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly destroyRef = inject(DestroyRef);

  readonly alerts = this.alertsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly alertsCount = computed(() => this.alerts().length);

  constructor(private readonly alertApi: AlertApi) {}

  getAlertById(id: number | null | undefined): Signal<Alert | undefined> {
    return computed(() => id ? this.alerts().find(a => a.id === id) : undefined);
  }

  addAlert(alert: Alert): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.alertApi.createAlert(alert).pipe(
      takeUntilDestroyed(this.destroyRef),
      retry(2)
    ).subscribe({
      next: createdAlert => {
        this.alertsSignal.update(alerts => [...alerts, createdAlert]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create alert'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateAlert(updatedAlert: Alert): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.alertApi.updateAlert(updatedAlert).pipe(
      takeUntilDestroyed(this.destroyRef),
      retry(2)
    ).subscribe({
      next: alert => {
        this.alertsSignal.update(alerts => alerts.map(a => a.id === alert.id ? alert : a));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update alert'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteAlert(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.alertApi.deleteAlert(id).pipe(
      takeUntilDestroyed(this.destroyRef),
      retry(2)
    ).subscribe({
      next: () => {
        this.alertsSignal.update(alerts => alerts.filter(a => a.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete alert'));
        this.loadingSignal.set(false);
      }
    });
  }

  loadAlerts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.alertApi.getAlerts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: alerts => {
        this.alertsSignal.set(alerts);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load alerts'));
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error)
      return error.message;
    return fallback;
  }
}
