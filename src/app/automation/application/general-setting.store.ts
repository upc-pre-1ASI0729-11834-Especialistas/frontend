import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
import { GeneralSetting } from '../domain/model/general-setting.entity';
import { GeneralSettingsApi } from '../infrastructure/general-setting-api';

@Injectable({ providedIn: 'root' })
export class GeneralSettingStore {
  private readonly destroyRef = inject(DestroyRef);

  private readonly generalSettingsSignal = signal<GeneralSetting[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly generalSettings = this.generalSettingsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly generalSettingsCount = computed(() => this.generalSettings().length);

  constructor(private readonly generalSettingsApi: GeneralSettingsApi) {
    this.loadGeneralSettings();
  }

  getGeneralSettingById(id: number | null | undefined): Signal<GeneralSetting | undefined> {
    return computed(() => id ? this.generalSettings().find(e => e.id === id) : undefined);
  }

  updateGeneralSetting(id: number, value: string): Observable<GeneralSetting> {
    this.loadingSignal.set(true);
    const existing = this.generalSettingsSignal().find(s => s.id === id);
    if (!existing) {
      throw new Error(`GeneralSetting with id ${id} not found`);
    }

    const updatedEntity = new GeneralSetting({
      id: existing.id,
      key: existing.key,
      value: value,
      category: existing.category,
      description: existing.description
    });

    return this.generalSettingsApi.updateGeneralSetting(id, updatedEntity).pipe(
      tap({
        next: saved => {
          this.generalSettingsSignal.update(list =>
            list.map(item => item.id === id ? saved : item)
          );
          this.loadingSignal.set(false);
        },
        error: err => {
          this.handleError(err, 'Failed to update general setting');
        }
      })
    );
  }

  private loadGeneralSettings(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.generalSettingsApi.getGeneralSettings().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.generalSettingsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => this.handleError(err, 'Failed to load general settings')
    });
  }

  private handleError(error: any, fallback: string): void {
    this.errorSignal.set(error instanceof Error ? error.message : fallback);
    this.loadingSignal.set(false);
  }
}
