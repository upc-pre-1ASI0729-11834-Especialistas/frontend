import { TemperatureReadingApi } from '../infrastructure/temperature-reading-api';
import { TemperatureReading } from '../domain/model/temperature-reading.entity';
import { DestroyRef, inject, Injectable, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({providedIn: 'root'})
export class TemperatureReadingStore {
  private readonly rawReadingsSignal = signal<TemperatureReading[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly periodSignal = signal<string>('2m');
  private readonly metricKeySignal = signal<string>('temperature');
  private readonly destroyRef = inject(DestroyRef);

  readonly readings = computed(() => {
    return this.filterAndAggregate(this.rawReadingsSignal(), this.periodSignal());
  });

  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly selectedPeriod = this.periodSignal.asReadonly();
  readonly selectedMetricKey = this.metricKeySignal.asReadonly();

  constructor(private readonly temperatureApi: TemperatureReadingApi) {}

  setPeriod(period: string): void {
    this.periodSignal.set(period);
    this.loadReadings();
  }

  setMetricKey(metricKey: string): void {
    this.metricKeySignal.set(metricKey);
    this.loadReadings();
  }

  loadReadings(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.temperatureApi.getReadingsByMetric(this.metricKeySignal()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: readings => {
        this.rawReadingsSignal.set(readings);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, `Failed to load ${this.metricKeySignal()} readings`));
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error)
      return error.message;
    return fallback;
  }

  private filterAndAggregate(raw: TemperatureReading[], period: string): TemperatureReading[] {
    if (!raw || raw.length === 0) {
      return [];
    }

    // Sort raw readings chronologically
    const sorted = [...raw].sort((a, b) => {
      return this.parseDateString(a.date).getTime() - this.parseDateString(b.date).getTime();
    });

    const maxDate = this.parseDateString(sorted[sorted.length - 1].date);

    if (period === '2m') {
      const result: TemperatureReading[] = [];
      let idCounter = 1;

      // We want exactly 12 intervals of 10 seconds ending at maxDate:
      // T_0 = maxDate - 110s, T_1 = maxDate - 100s, ..., T_11 = maxDate
      const intervals: Date[] = [];
      for (let i = 11; i >= 0; i--) {
        intervals.push(new Date(maxDate.getTime() - i * 10 * 1000));
      }

      for (const T of intervals) {
        const tMs = T.getTime();
        const windowStart = tMs - 5 * 1000;
        const windowEnd = tMs + 5 * 1000;

        // Find readings in this specific 10s window
        const readingsInWindow = sorted.filter(r => {
          const rTime = this.parseDateString(r.date).getTime();
          return rTime >= windowStart && rTime <= windowEnd;
        });

        let avgValues: { [labId: string]: number } = {};

        if (readingsInWindow.length > 0) {
          // If we have readings in this window, average them
          avgValues = this.averageValues(readingsInWindow);
        } else {
          // If no readings in this window, look for the most recent reading prior to this window's end
          const priorReadings = sorted.filter(r => {
            const rTime = this.parseDateString(r.date).getTime();
            return rTime <= windowEnd;
          });

          if (priorReadings.length > 0) {
            // Grab the latest one prior to this interval
            const latestPrior = priorReadings[priorReadings.length - 1];
            avgValues = { ...latestPrior.values };
          } else {
            // No prior data exists at all (e.g. beginning of data stream)
            avgValues = {};
          }
        }

        result.push(new TemperatureReading({
          id: idCounter++,
          date: this.format10SecondLabel(T),
          values: avgValues
        }));
      }

      return result;
    } else if (period === '24h') {
      // Last 24 hours cutoff
      const cutoff = new Date(maxDate.getTime() - 24 * 60 * 60 * 1000);
      const inRange = sorted.filter(r => this.parseDateString(r.date) >= cutoff);

      // Group by hour key: "YYYY-MM-DD HH:00"
      const hourlyGroups: { [hourKey: string]: TemperatureReading[] } = {};
      for (const r of inRange) {
        const d = this.parseDateString(r.date);
        const hourKey = this.formatHourKey(d);
        if (!hourlyGroups[hourKey]) {
          hourlyGroups[hourKey] = [];
        }
        hourlyGroups[hourKey].push(r);
      }

      // Convert groups to averaged TemperatureReading array
      const result: TemperatureReading[] = [];
      let idCounter = 1;
      const sortedHourKeys = Object.keys(hourlyGroups).sort();

      for (const key of sortedHourKeys) {
        const group = hourlyGroups[key];
        const avgValues = this.averageValues(group);
        const d = this.parseDateString(key.replace(' ', 'T') + ':00');

        result.push(new TemperatureReading({
          id: idCounter++,
          date: this.formatHour(d),
          values: avgValues
        }));
      }

      return result;
    } else {
      // 7d or 30d period
      const daysLimit = period === '7d' ? 7 : 30;
      
      const startOfMaxDay = new Date(maxDate.getTime());
      startOfMaxDay.setHours(0, 0, 0, 0);
      const cutoff = new Date(startOfMaxDay.getTime() - (daysLimit - 1) * 24 * 60 * 60 * 1000);

      const inRange = sorted.filter(r => this.parseDateString(r.date) >= cutoff);

      // Group by day key: "YYYY-MM-DD"
      const dailyGroups: { [dayKey: string]: TemperatureReading[] } = {};
      for (const r of inRange) {
        const d = this.parseDateString(r.date);
        const dayKey = this.formatDateKey(d);
        if (!dailyGroups[dayKey]) {
          dailyGroups[dayKey] = [];
        }
        dailyGroups[dayKey].push(r);
      }

      // Convert groups to averaged TemperatureReading array
      const result: TemperatureReading[] = [];
      let idCounter = 1;
      const sortedDayKeys = Object.keys(dailyGroups).sort();

      for (const key of sortedDayKeys) {
        const group = dailyGroups[key];
        const avgValues = this.averageValues(group);

        result.push(new TemperatureReading({
          id: idCounter++,
          date: key,
          values: avgValues
        }));
      }

      return result;
    }
  }

  private parseDateString(dateStr: string): Date {
    let normalized = dateStr;
    if (normalized.includes(' ')) {
      normalized = normalized.replace(' ', 'T');
    } else if (!normalized.includes('T') && normalized.length === 10) {
      normalized = normalized + 'T00:00:00';
    }
    return new Date(normalized);
  }

  private format10SecondKey(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const sec = String(Math.floor(d.getSeconds() / 10) * 10).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}:${sec}`;
  }

  private format10SecondLabel(d: Date): string {
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const sec = String(d.getSeconds()).padStart(2, '0');
    return `${hh}:${min}:${sec}`;
  }

  private formatHourKey(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:00`;
  }

  private formatDateKey(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private formatHour(d: Date): string {
    return String(d.getHours()).padStart(2, '0') + ':00';
  }

  private averageValues(readings: TemperatureReading[]): { [labId: string]: number } {
    const sum: { [labId: string]: number } = {};
    const count: { [labId: string]: number } = {};

    for (const r of readings) {
      for (const labId of Object.keys(r.values)) {
        if (sum[labId] === undefined) {
          sum[labId] = 0;
          count[labId] = 0;
        }
        sum[labId] += r.values[labId];
        count[labId]++;
      }
    }

    const avg: { [labId: string]: number } = {};
    for (const labId of Object.keys(sum)) {
      avg[labId] = Math.round((sum[labId] / count[labId]) * 10) / 10;
    }
    return avg;
  }
}
