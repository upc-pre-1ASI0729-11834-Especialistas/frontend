import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type LaboratoryStatus = 'OPERATIONAL' | 'WARNING' | 'CRITICAL';

export type LaboratoryType =
  | 'Biological Safety'
  | 'Chemical Synthesis'
  | 'Cryogenic Storage'
  | 'Clean Room ISO 5'
  | 'Material Science'
  | 'Analytical'
  | 'Radiation Controlled'
  | 'Molecular Biology'
  | 'Environmental'
  | 'Biohazard Level 2'
  | 'Biohazard Level 3';

export type GasSensitivity = 'Low - General labs' | 'Medium - Chemical labs' | 'High - Hazmat areas';

export type AlertEscalation = 'Immediate - Stop all activity' | 'Gradual - Warn then escalate' | 'Monitor - Log only';

export interface SensorConfig {
  temperature: boolean;
  airQuality: boolean;
  aiDetection: boolean;
  ventilation: boolean;
  airConditioning: boolean;
  vibration: boolean;
  lighting: boolean;
}

export interface SafetyThresholds {
  temperatureMin: number;
  temperatureMax: number;
  maxCo2Ppm: number;
  gasSensitivity: GasSensitivity | '';
  maxVibrationLevel: number;
  alertEscalation: AlertEscalation | '';
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  criticalOnly: boolean;
}

export interface LabMetric {
  name: string;
  value: string;
  unit: string;
  status: string;
  icon: string;
  sparkline: number[];
  threshold?: number;
  objectType?: string;
}

export interface LabAlert {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  severity: string;
}

export interface LabActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface LabSchedule {
  id: string;
  name: string;
  timeRange: string;
  active: boolean;
  icon: string;
}

export class Laboratory implements BaseEntity {
  private _id: number;
  private _name: string;
  private _type: LaboratoryType;
  private _status: string;
  private _building: string;
  private _floor: string;
  private _labCode: string;
  private _overallStatus: string;
  private _active: boolean;
  private _lastUpdate: string;
  private _isLive: boolean;
  private _nextMaintenance: string;
  private _maintenanceDaysLeft: number;
  private _metrics: LabMetric[];
  private _recentAlerts: LabAlert[];
  private _recentActivities: LabActivity[];
  private _schedules: LabSchedule[];


  private _roomNumber?: string;
  private _description?: string;
  private _sensors?: SensorConfig;
  private _thresholds?: SafetyThresholds;
  private _notifications?: NotificationPreferences;

  constructor(data: {
    id: number;
    name: string;
    type: LaboratoryType;
    status: string;
    building: string;
    floor: string;
    labCode: string;
    overallStatus: string;
    active: boolean;
    lastUpdate: string;
    isLive: boolean;
    nextMaintenance: string;
    maintenanceDaysLeft: number;
    metrics: LabMetric[];
    recentAlerts: LabAlert[];
    recentActivities: LabActivity[];
    schedules: LabSchedule[];
    roomNumber?: string;
    description?: string;
    sensors?: SensorConfig;
    thresholds?: SafetyThresholds;
    notifications?: NotificationPreferences;
  }) {
    this._id = data.id;
    this._name = data.name;
    this._type = data.type;
    this._status = data.status;
    this._building = data.building;
    this._floor = data.floor;
    this._labCode = data.labCode;
    this._overallStatus = data.overallStatus;
    this._active = data.active;
    this._lastUpdate = data.lastUpdate;
    this._isLive = data.isLive;
    this._nextMaintenance = data.nextMaintenance;
    this._maintenanceDaysLeft = data.maintenanceDaysLeft;
    this._metrics = data.metrics;
    this._recentAlerts = data.recentAlerts;
    this._recentActivities = data.recentActivities;
    this._schedules = data.schedules;
    this._roomNumber = data.roomNumber;
    this._description = data.description;
    this._sensors = data.sensors;
    this._thresholds = data.thresholds;
    this._notifications = data.notifications;
  }


  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get type(): LaboratoryType { return this._type; }
  set type(value: LaboratoryType) { this._type = value; }

  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }

  get building(): string { return this._building; }
  set building(value: string) { this._building = value; }

  get floor(): string { return this._floor; }
  set floor(value: string) { this._floor = value; }

  get labCode(): string { return this._labCode; }
  set labCode(value: string) { this._labCode = value; }

  get overallStatus(): string { return this._overallStatus; }
  set overallStatus(value: string) { this._overallStatus = value; }

  get active(): boolean { return this._active; }
  set active(value: boolean) { this._active = value; }

  get lastUpdate(): string { return this._lastUpdate; }
  set lastUpdate(value: string) { this._lastUpdate = value; }

  get isLive(): boolean { return this._isLive; }
  set isLive(value: boolean) { this._isLive = value; }

  get nextMaintenance(): string { return this._nextMaintenance; }
  set nextMaintenance(value: string) { this._nextMaintenance = value; }

  get maintenanceDaysLeft(): number { return this._maintenanceDaysLeft; }
  set maintenanceDaysLeft(value: number) { this._maintenanceDaysLeft = value; }

  get metrics(): LabMetric[] { return this._metrics; }
  set metrics(value: LabMetric[]) { this._metrics = value; }

  get recentAlerts(): LabAlert[] { return this._recentAlerts; }
  set recentAlerts(value: LabAlert[]) { this._recentAlerts = value; }

  get recentActivities(): LabActivity[] { return this._recentActivities; }
  set recentActivities(value: LabActivity[]) { this._recentActivities = value; }

  get schedules(): LabSchedule[] { return this._schedules; }
  set schedules(value: LabSchedule[]) { this._schedules = value; }

  get roomNumber(): string | undefined { return this._roomNumber; }
  set roomNumber(value: string | undefined) { this._roomNumber = value; }

  get description(): string | undefined { return this._description; }
  set description(value: string | undefined) { this._description = value; }

  get sensors(): SensorConfig | undefined { return this._sensors; }
  set sensors(value: SensorConfig | undefined) { this._sensors = value; }

  get thresholds(): SafetyThresholds | undefined { return this._thresholds; }
  set thresholds(value: SafetyThresholds | undefined) { this._thresholds = value; }

  get notifications(): NotificationPreferences | undefined { return this._notifications; }
  set notifications(value: NotificationPreferences | undefined) { this._notifications = value; }


  isOperational(): boolean {
    return this._overallStatus.toLowerCase() === 'operational';
  }

  isWarning(): boolean {
    return this._overallStatus.toLowerCase() === 'warning';
  }

  isCritical(): boolean {
    return this._overallStatus.toLowerCase() === 'critical';
  }

  getLocationDisplay(): string {
    return `${this._building} • ${this._floor} • # ID: ${this._labCode}`;
  }

  getMaintenanceBadgeLabel(): string {
    if (this._maintenanceDaysLeft <= 0) return 'Overdue';
    if (this._maintenanceDaysLeft === 1) return 'Tomorrow';
    return `In ${this._maintenanceDaysLeft} days`;
  }
  getLocation(): string {
    return `${this.building}, ${this.floor}`;
  }
  getFormattedMaintenance(): string {
    const date = new Date(this.nextMaintenance);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  isMaintenanceUrgent(): boolean {
    return this.maintenanceDaysLeft <= 3;
  }
}

