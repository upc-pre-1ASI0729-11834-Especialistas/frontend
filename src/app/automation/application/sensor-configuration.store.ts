import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
import { SensorConfiguration } from '../domain/model/sensor-configuration.entity';
import { SensorConfigurationsApi } from '../infrastructure/sensor-configuration-api';

@Injectable({ providedIn: 'root' })
export class SensorConfigurationStore {
  private readonly destroyRef = inject(DestroyRef);

  private readonly sensorConfigurationsSignal = signal<SensorConfiguration[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly sensorConfigurations = this.sensorConfigurationsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly sensorConfigurationsCount = computed(() => this.sensorConfigurations().length);

  constructor(private readonly sensorConfigurationsApi: SensorConfigurationsApi) {
    this.loadSensorConfigurations();
  }

  getSensorConfigurationById(id: number | null | undefined): Signal<SensorConfiguration | undefined> {
    return computed(() => id ? this.sensorConfigurations().find(e => e.id === id) : undefined);
  }

  createSensorConfiguration(sensor: SensorConfiguration): Observable<SensorConfiguration> {
    this.loadingSignal.set(true);
    return this.sensorConfigurationsApi.createSensorConfiguration(sensor).pipe(
      tap({
        next: saved => {
          this.sensorConfigurationsSignal.update(list => [...list, saved]);
          this.loadingSignal.set(false);
        },
        error: err => this.handleError(err, 'Failed to create sensor configuration')
      })
    );
  }

  updateSensorConfiguration(id: number, sensor: SensorConfiguration): Observable<SensorConfiguration> {
    this.loadingSignal.set(true);
    return this.sensorConfigurationsApi.updateSensorConfiguration(id, sensor).pipe(
      tap({
        next: saved => {
          this.sensorConfigurationsSignal.update(list =>
            list.map(item => item.id === id ? saved : item)
          );
          this.loadingSignal.set(false);
        },
        error: err => this.handleError(err, 'Failed to update sensor configuration')
      })
    );
  }

  calibrateSensor(id: number, certificateId: string, expirationDate: Date, calibratedAt: Date): Observable<SensorConfiguration> {
    this.loadingSignal.set(true);
    return this.sensorConfigurationsApi.calibrateSensor(id, certificateId, expirationDate, calibratedAt).pipe(
      tap({
        next: saved => {
          this.sensorConfigurationsSignal.update(list =>
            list.map(item => item.id === id ? saved : item)
          );
          this.loadingSignal.set(false);
        },
        error: err => this.handleError(err, 'Failed to calibrate sensor')
      })
    );
  }

  private loadSensorConfigurations(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.sensorConfigurationsApi.getSensorConfigurations().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.sensorConfigurationsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => this.handleError(err, 'Failed to load sensor configurations')
    });
  }

  private handleError(error: any, fallback: string): void {
    this.errorSignal.set(error instanceof Error ? error.message : fallback);
    this.loadingSignal.set(false);
  }
}
