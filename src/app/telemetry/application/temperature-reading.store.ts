import { TemperatureReadingApi } from '../infrastructure/temperature-reading-api';
import { TemperatureReading } from '../domain/model/temperature-reading.entity';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({providedIn: 'root'})
export class TemperatureReadingStore {
  private readonly readingsSignal = signal<TemperatureReading[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly periodSignal = signal<string>('30d');
  private readonly destroyRef = inject(DestroyRef);

  readonly readings = this.readingsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly selectedPeriod = this.periodSignal.asReadonly();

  constructor(private readonly temperatureApi: TemperatureReadingApi) {
    this.loadReadings();
  }

  setPeriod(period: string): void {
    this.periodSignal.set(period);
    this.loadReadings();
  }

  private loadReadings(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.temperatureApi.getReadings().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: readings => {
        this.readingsSignal.set(readings);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load temperature readings'));
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
