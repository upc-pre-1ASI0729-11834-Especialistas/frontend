import { AlertsApi } from './../infrastructure/alerts-api';
import { Alert } from './../domain/model/alert.entity';
import { computed, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AlertsStore {
  // State signals
  private readonly alertsSignal = signal<Alert[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  // Readonly signals
  readonly alerts = this.alertsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  // Computed signals
  readonly alertsCount = computed(() => this.alerts().length);
  readonly loading = this.loadingSignal.asReadonly();

  constructor(private readonly alertsApi: AlertsApi) {
    this.loadAlerts();
  }

  getAlertById(id: number | null | undefined): Signal<Alert | undefined> {
    return computed(() => id ? this.alerts().find(a => a.id === id) : undefined);
  }

  addAlert(alert: Alert): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.alertsApi.createAlert(alert).pipe(retry(2)).subscribe({
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
    this.alertsApi.updateAlert(updatedAlert).pipe(retry(2)).subscribe({
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
    this.alertsApi.deleteAlert(id).pipe(retry(2)).subscribe({
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

  private loadAlerts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.alertsApi.getAlerts().pipe(takeUntilDestroyed()).subscribe({
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

  private formatError(error: any,  fallback: string): string {
    if (error instanceof Error)
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    return fallback;
  }

}
