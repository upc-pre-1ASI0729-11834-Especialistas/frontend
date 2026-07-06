import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
import { EquipmentThreshold } from '../domain/model/equipment-threshold.entity';
import { EquipmentThresholdsApi } from '../infrastructure/equipment-threshold-api';

@Injectable({ providedIn: 'root' })
export class EquipmentThresholdStore {
  private readonly destroyRef = inject(DestroyRef);

  private readonly equipmentThresholdsSignal = signal<EquipmentThreshold[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly equipmentThresholds = this.equipmentThresholdsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly equipmentThresholdsCount = computed(() => this.equipmentThresholds().length);

  constructor(private readonly equipmentThresholdsApi: EquipmentThresholdsApi) {}

  getEquipmentThresholdById(id: number | null | undefined): Signal<EquipmentThreshold | undefined> {
    return computed(() => id ? this.equipmentThresholds().find(e => e.id === id) : undefined);
  }

  loadEquipmentThresholds(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.equipmentThresholdsApi.getEquipmentThresholds().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.equipmentThresholdsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => this.handleError(err, 'Failed to load equipment thresholds')
    });
  }

  updateEquipmentThreshold(id: number, data: {
    minThreshold?: number;
    maxThreshold?: number;
    warningAt?: number;
    name?: string;
    icon?: string;
    lab?: string;
    unit?: string;
    currentValue?: number;
    status?: string;
  }): Observable<EquipmentThreshold> {
    this.loadingSignal.set(true);
    const currentList = this.equipmentThresholds();
    const existing = currentList.find(e => e.id === id);
    if (!existing) {
      throw new Error(`EquipmentThreshold with id ${id} not found`);
    }

    const updatedEntity = new EquipmentThreshold({
      id: existing.id,
      name: data.name ?? existing.name,
      icon: data.icon ?? existing.icon,
      lab: data.lab ?? existing.lab,
      minThreshold: data.minThreshold !== undefined ? data.minThreshold : existing.minThreshold,
      maxThreshold: data.maxThreshold !== undefined ? data.maxThreshold : existing.maxThreshold,
      warningAt: data.warningAt !== undefined ? data.warningAt : existing.warningAt,
      unit: data.unit ?? existing.unit,
      currentValue: data.currentValue !== undefined ? data.currentValue : existing.currentValue,
      status: data.status ?? existing.status,
    });

    return this.equipmentThresholdsApi.updateEquipmentThreshold(id, updatedEntity).pipe(
      tap({
        next: saved => {
          this.equipmentThresholdsSignal.update(list =>
            list.map(item => item.id === id ? saved : item)
          );
          this.loadingSignal.set(false);
        },
        error: err => {
          this.handleError(err, 'Failed to update equipment threshold');
        }
      })
    );
  }

  addEquipmentThreshold(newThreshold: EquipmentThreshold): Observable<EquipmentThreshold> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    return this.equipmentThresholdsApi.createEquipmentThreshold(newThreshold).pipe(
      tap({
        next: saved => {
          this.equipmentThresholdsSignal.update(list => [...list, saved]);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.handleError(err, 'Failed to add equipment threshold');
        }
      })
    );
  }

  private handleError(error: any, fallback: string): void {
    this.errorSignal.set(error instanceof Error ? error.message : fallback);
    this.loadingSignal.set(false);
  }
}
