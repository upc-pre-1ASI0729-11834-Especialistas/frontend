import { LaboratoryApi } from '../infrastructure/laboratory-api';
import { Laboratory } from '../domain/model/laboratory.entity';
import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

@Injectable({providedIn: 'root'})
export class LaboratoryStore {
  private readonly laboratoriesSignal = signal<Laboratory[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly destroyRef = inject(DestroyRef);

  readonly laboratories = this.laboratoriesSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly laboratoriesCount = computed(() => this.laboratories().length);

  constructor(private readonly laboratoryApi: LaboratoryApi) {}

  getLaboratoryById(id: number | null | undefined): Signal<Laboratory | undefined> {
    return computed(() => id ? this.laboratories().find(l => l.id === id) : undefined);
  }

  loadLaboratories(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.laboratoryApi.getLaboratories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: labs => {
        this.laboratoriesSignal.set(labs);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load laboratories'));
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
