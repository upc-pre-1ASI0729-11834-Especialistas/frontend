import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface LabMetricResource {
  name: string;
  value: string;
  unit: string;
  status: string;
  icon: string;
  sparkline: number[];
  threshold?: number;
  objectType?: string;
}

export interface LabAlertResource {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  severity: string;
}

export interface LabActivityResource {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface LabScheduleResource {
  id: string;
  name: string;
  timeRange: string;
  active: boolean;
  icon: string;
}

export interface SensorConfigResource {
  temperature: boolean;
  airQuality: boolean;
  aiDetection: boolean;
  ventilation: boolean;
  airConditioning: boolean;
  vibration: boolean;
  lighting: boolean;
}

export interface SafetyThresholdsResource {
  temperatureMin: number;
  temperatureMax: number;
  maxCo2Ppm: number;
  gasSensitivity: string;
  maxVibrationLevel: number;
  alertEscalation: string;
}

export interface NotificationPreferencesResource {
  email: boolean;
  sms: boolean;
  push: boolean;
  criticalOnly: boolean;
}

export interface MetricSubscriptionResource {
  metricTypeId: number;
  metricTypeKey: string;
  metricTypeDisplayName: string;
  metricTypeUnit: string;
  metricTypeIcon: string;
  metricTypeCategory: string;
  minThreshold: number | null;
  maxThreshold: number | null;
  active: boolean;
}

export interface LaboratoryResource extends BaseResource {
  id: number;
  name: string;
  type: string;
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
  metrics: LabMetricResource[];
  recentAlerts: LabAlertResource[];
  recentActivities: LabActivityResource[];
  schedules: LabScheduleResource[];
  roomNumber?: string;
  description?: string;
  sensors?: SensorConfigResource;
  thresholds?: SafetyThresholdsResource;
  metricSubscriptions?: MetricSubscriptionResource[];
  notifications?: NotificationPreferencesResource;
}

export interface LaboratoryResponse extends BaseResponse {
  data: LaboratoryResource[];
  total: number;
  page: number;
  totalPages: number;
}
