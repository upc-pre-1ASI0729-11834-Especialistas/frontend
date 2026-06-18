import { MetricTypeApi } from '../infrastructure/metric-type-api';
import { MetricType } from '../domain/model/metric-type.entity';
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class MetricTypeStore {
  private readonly api = inject(MetricTypeApi);
  private readonly destroyRef = inject(DestroyRef);

  private readonly metricTypesSignal = signal<MetricType[]>([]);
  private readonly activeMetricTypesSignal = signal<MetricType[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly metricTypes = this.metricTypesSignal.asReadonly();
  readonly activeMetricTypes = this.activeMetricTypesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    this.loadAll();
    this.loadActive();
  }

  loadAll(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.getMetricTypes().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: types => this.metricTypesSignal.set(types),
      error: err => this.errorSignal.set(this.formatError(err, 'Failed to load metric types'))
    });
  }

  loadActive(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.getActiveMetricTypes().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: types => this.activeMetricTypesSignal.set(types),
      error: err => this.errorSignal.set(this.formatError(err, 'Failed to load active metric types'))
    });
  }

  create(metricType: MetricType, callback?: () => void): void {
    this.loadingSignal.set(true);
    this.api.createMetricType(metricType).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: () => {
        this.loadAll();
        this.loadActive();
        if (callback) callback();
      },
      error: err => this.errorSignal.set(this.formatError(err, 'Failed to create metric type'))
    });
  }

  update(metricType: MetricType, callback?: () => void): void {
    this.loadingSignal.set(true);
    this.api.updateMetricType(metricType).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: () => {
        this.loadAll();
        this.loadActive();
        if (callback) callback();
      },
      error: err => this.errorSignal.set(this.formatError(err, 'Failed to update metric type'))
    });
  }

  delete(id: number, callback?: () => void): void {
    this.loadingSignal.set(true);
    this.api.deleteMetricType(id).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: () => {
        this.loadAll();
        this.loadActive();
        if (callback) callback();
      },
      error: err => this.errorSignal.set(this.formatError(err, 'Failed to delete metric type'))
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error)
      return error.message;
    return fallback;
  }
}
