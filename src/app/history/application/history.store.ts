import { HistoryApi } from '../infrastructure/history-api';
import { HistoryRecord } from '../domain/model/history-record.entity';
import { computed, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryStore {
  private readonly historySignal = signal<HistoryRecord[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly history = this.historySignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  readonly historyCount = computed(() => this.history().length);

  constructor(private readonly historyApi: HistoryApi) {
    this.loadHistory();
  }

  getHistoryRecordById(id: number | null | undefined): Signal<HistoryRecord | undefined> {
    return computed(() => (id ? this.history().find(record => record.id === id) : undefined));
  }

  addHistoryRecord(record: HistoryRecord): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.historyApi.createHistoryRecord(record).pipe(retry(2)).subscribe({
      next: createdRecord => {
        this.historySignal.update(history => [...history, createdRecord]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create history record'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateHistoryRecord(record: HistoryRecord): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.historyApi.updateHistoryRecord(record).pipe(retry(2)).subscribe({
      next: updatedRecord => {
        this.historySignal.update(history => history.map(item => item.id === updatedRecord.id ? updatedRecord : item));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update history record'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteHistoryRecord(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.historyApi.deleteHistoryRecord(id).pipe(retry(2)).subscribe({
      next: () => {
        this.historySignal.update(history => history.filter(item => item.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete history record'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadHistory(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.historyApi.getHistory().pipe(takeUntilDestroyed()).subscribe({
      next: history => {
        this.historySignal.set(history);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load history'));
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}

