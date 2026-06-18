import { inject, Injectable, signal } from '@angular/core';
import { StatsStore } from './stats.store';
import { LaboratoryStore } from './laboratory.store';
import { AlertStore } from './alert.store';
import { TemperatureReadingStore } from './temperature-reading.store';
import { computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly statsStore = inject(StatsStore);
  private readonly laboratoryStore = inject(LaboratoryStore);
  private readonly alertStore = inject(AlertStore);
  private readonly temperatureStore = inject(TemperatureReadingStore);

  readonly stats = this.statsStore.stats;
  readonly laboratories = this.laboratoryStore.laboratories;
  readonly recentAlerts = this.alertStore.alerts;
  readonly temperatureTrends = this.temperatureStore.readings;
  readonly selectedPeriod = this.temperatureStore.selectedPeriod;

  readonly loading = computed(() => 
    this.statsStore.loading() || 
    this.laboratoryStore.loading() || 
    this.alertStore.loading() || 
    this.temperatureStore.loading()
  );

  loadAll(): void {
    
    
  }

  loadTemperatureTrends(period: string): void {
    this.temperatureStore.setPeriod(period);
  }
}

