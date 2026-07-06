import { StatsApi } from '../infrastructure/stats-api';
import { DashboardStats } from '../domain/model/dashboard-stats.entity';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({providedIn: 'root'})
export class StatsStore {
  private readonly statsSignal = signal<DashboardStats | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly destroyRef = inject(DestroyRef);

  readonly stats = this.statsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  constructor(private readonly statsApi: StatsApi) {}

  loadStats(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.statsApi.getStats().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: statsArray => {
        
        if (statsArray.length > 0) {
          this.statsSignal.set(statsArray[0]);
        }
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load stats'));
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

