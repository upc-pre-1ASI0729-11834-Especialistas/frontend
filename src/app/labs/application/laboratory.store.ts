import { inject, Injectable, signal, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Laboratory, LaboratoryType, GasSensitivity, AlertEscalation, SensorConfig, SafetyThresholds, NotificationPreferences } from '../domain/model/laboratory.entity';
import { LaboratoryApi } from '../infrastructure/laboratory-api';
import { finalize, retry, tap } from 'rxjs';

export interface LaboratoryFormData {
  name: string;
  labCode: string;
  type: LaboratoryType | '';
  building: string;
  floor: string;
  roomNumber: string;
  description: string;
  sensors: SensorConfig;
  thresholds: SafetyThresholds;
  notifications: NotificationPreferences;
}

@Injectable({
  providedIn: 'root'
})
export class LaboratoryStore {
  private readonly api = inject(LaboratoryApi);
  private readonly destroyRef = inject(DestroyRef);


  private readonly laboratoriesSignal = signal<Laboratory[]>([]);
  private readonly selectedLaboratorySignal = signal<Laboratory | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);


  private readonly totalCountSignal = signal<number>(0);
  private readonly currentPageSignal = signal<number>(1);
  private readonly pageSizeSignal = signal<number>(6);
  private readonly totalPagesSignal = signal<number>(1);

  private readonly searchQuerySignal = signal<string>('');
  private readonly statusFilterSignal = signal<string>('All');
  private readonly locationFilterSignal = signal<string>('All');


  private readonly locationsSignal = signal<string[]>([]);
  private readonly statusCountsSignal = signal<{ operational: number; warning: number; critical: number }>({
    operational: 0,
    warning: 0,
    critical: 0,
  });


  private readonly activeTabSignal = signal<string>('systems');


  private readonly creationSuccessSignal = signal<boolean>(false);
  private readonly lastCreatedLabSignal = signal<Laboratory | null>(null);


  readonly laboratories = this.laboratoriesSignal.asReadonly();
  readonly selectedLaboratory = this.selectedLaboratorySignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly totalCount = this.totalCountSignal.asReadonly();
  readonly currentPage = this.currentPageSignal.asReadonly();
  readonly pageSize = this.pageSizeSignal.asReadonly();
  readonly totalPages = this.totalPagesSignal.asReadonly();

  readonly searchQuery = this.searchQuerySignal.asReadonly();
  readonly statusFilter = this.statusFilterSignal.asReadonly();
  readonly locationFilter = this.locationFilterSignal.asReadonly();

  readonly locations = this.locationsSignal.asReadonly();
  readonly statusCounts = this.statusCountsSignal.asReadonly();
  readonly activeTab = this.activeTabSignal.asReadonly();

  readonly creationSuccess = this.creationSuccessSignal.asReadonly();
  readonly lastCreatedLab = this.lastCreatedLabSignal.asReadonly();


  readonly showingFrom = computed(() => {
    const total = this.totalCountSignal();
    if (total === 0) return 0;
    return (this.currentPageSignal() - 1) * this.pageSizeSignal() + 1;
  });

  readonly showingTo = computed(() => {
    const from = this.showingFrom();
    const count = this.laboratoriesSignal().length;
    return from + count - 1;
  });

  readonly pages = computed(() => {
    const total = this.totalPagesSignal();
    const current = this.currentPageSignal();
    const pages: (number | '...')[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  });


  readonly labTypes: LaboratoryType[] = [
    'Biological Safety', 'Chemical Synthesis', 'Cryogenic Storage',
    'Clean Room ISO 5', 'Material Science', 'Analytical',
    'Radiation Controlled', 'Molecular Biology', 'Environmental',
    'Biohazard Level 2', 'Biohazard Level 3'
  ];
  readonly buildings = ['Building A', 'Building B', 'Building C', 'Building D'];
  readonly floors = ['Basement', 'Floor B1', 'Level 1', 'Floor 1', 'Floor 2', 'Floor 3', 'Floor 4'];
  readonly gasSensitivities: GasSensitivity[] = ['Low - General labs', 'Medium - Chemical labs', 'High - Hazmat areas'];
  readonly alertEscalations: AlertEscalation[] = ['Immediate - Stop all activity', 'Gradual - Warn then escalate', 'Monitor - Log only'];

  constructor() {
    this.loadFilterData();
    this.loadLaboratories();
  }


  loadLaboratories(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.getAll().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: (allLabs) => {
        const status = this.statusFilterSignal();
        const location = this.locationFilterSignal();
        const search = this.searchQuerySignal().toLowerCase();

        let filtered = allLabs;

        if (status && status !== 'All') {
          filtered = filtered.filter(l => l.overallStatus === status);
        }
        if (location && location !== 'All') {
          filtered = filtered.filter(l => l.building === location);
        }
        if (search) {
          filtered = filtered.filter(l => l.name.toLowerCase().includes(search));
        }

        this.totalCountSignal.set(filtered.length);

        const page = this.currentPageSignal();
        const limit = this.pageSizeSignal();
        this.totalPagesSignal.set(Math.ceil(filtered.length / limit) || 1);

        const start = (page - 1) * limit;
        const end = start + limit;

        this.laboratoriesSignal.set(filtered.slice(start, end));
      },
      error: (err) => this.errorSignal.set(err.message)
    });
  }

  loadLaboratoryById(id: number): void {
    this.loadingSignal.set(true);
    this.api.getById(id).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: (lab) => this.selectedLaboratorySignal.set(lab),
      error: (err) => this.errorSignal.set(err.message)
    });
  }

  addRecentActivityToSelected(activity: any): void {
    const currentLab = this.selectedLaboratorySignal();
    if (currentLab) {
      const updatedLab = new Laboratory({
        id: currentLab.id,
        name: currentLab.name,
        type: currentLab.type,
        status: currentLab.status,
        building: currentLab.building,
        floor: currentLab.floor,
        labCode: currentLab.labCode,
        overallStatus: currentLab.overallStatus,
        active: currentLab.active,
        lastUpdate: currentLab.lastUpdate,
        isLive: currentLab.isLive,
        nextMaintenance: currentLab.nextMaintenance,
        maintenanceDaysLeft: currentLab.maintenanceDaysLeft,
        metrics: currentLab.metrics,
        recentAlerts: currentLab.recentAlerts,
        recentActivities: [activity, ...currentLab.recentActivities],
        schedules: currentLab.schedules,
        roomNumber: currentLab.roomNumber,
        description: currentLab.description,
        sensors: currentLab.sensors,
        thresholds: currentLab.thresholds,
        notifications: currentLab.notifications
      });
      this.selectedLaboratorySignal.set(updatedLab);
    }
  }

  loadFilterData(): void {
    this.api.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (labs) => {
        const buildings = [...new Set(labs.map(l => l.building))].sort();
        this.locationsSignal.set(buildings);

        this.statusCountsSignal.set({
          operational: labs.filter(l => l.isOperational()).length,
          warning: labs.filter(l => l.isWarning()).length,
          critical: labs.filter(l => l.isCritical()).length,
        });
      }
    });
  }

  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
    this.currentPageSignal.set(1);
    this.loadLaboratories();
  }

  setStatusFilter(status: string): void {
    this.statusFilterSignal.set(status);
    this.currentPageSignal.set(1);
    this.loadLaboratories();
  }

  setLocationFilter(location: string): void {
    this.locationFilterSignal.set(location);
    this.currentPageSignal.set(1);
    this.loadLaboratories();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPagesSignal()) return;
    this.currentPageSignal.set(page);
    this.loadLaboratories();
  }

  nextPage(): void {
    this.goToPage(this.currentPageSignal() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPageSignal() - 1);
  }

  setActiveTab(tab: string): void {
    this.activeTabSignal.set(tab);
  }

  createLaboratory(laboratory: Laboratory): void {
    this.loadingSignal.set(true);
    this.creationSuccessSignal.set(false);

    this.api.create(laboratory).pipe(
      takeUntilDestroyed(this.destroyRef),
      retry(2),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: (created) => {
        this.lastCreatedLabSignal.set(created);
        this.creationSuccessSignal.set(true);
        this.loadLaboratories();
      },
      error: (err) => this.errorSignal.set(err.message)
    });
  }

  resetCreationState(): void {
    this.creationSuccessSignal.set(false);
    this.lastCreatedLabSignal.set(null);
  }
}

