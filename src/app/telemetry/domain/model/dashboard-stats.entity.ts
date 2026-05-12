import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class DashboardStats implements BaseEntity {
  private _id: number;
  private _totalLaboratories: number;
  private _activeAlerts: number;
  private _systemsHealth: number;
  private _upcomingMaintenance: number;

  constructor(data: { id: number; totalLaboratories: number; activeAlerts: number; systemsHealth: number; upcomingMaintenance: number }) {
    this._id = data.id;
    this._totalLaboratories = data.totalLaboratories;
    this._activeAlerts = data.activeAlerts;
    this._systemsHealth = data.systemsHealth;
    this._upcomingMaintenance = data.upcomingMaintenance;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get totalLaboratories(): number {
    return this._totalLaboratories;
  }

  set totalLaboratories(value: number) {
    this._totalLaboratories = value;
  }

  get activeAlerts(): number {
    return this._activeAlerts;
  }

  set activeAlerts(value: number) {
    this._activeAlerts = value;
  }

  get systemsHealth(): number {
    return this._systemsHealth;
  }

  set systemsHealth(value: number) {
    this._systemsHealth = value;
  }

  get upcomingMaintenance(): number {
    return this._upcomingMaintenance;
  }

  set upcomingMaintenance(value: number) {
    this._upcomingMaintenance = value;
  }

  getHealthPercentage(): string {
    return `${this._systemsHealth}%`;
  }

  hasActiveAlerts(): boolean {
    return this._activeAlerts > 0;
  }

  isHealthy(): boolean {
    return this._systemsHealth >= 90;
  }
}
