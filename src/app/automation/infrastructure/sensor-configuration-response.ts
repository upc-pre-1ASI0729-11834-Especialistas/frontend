import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface SensorConfigurationResource extends BaseResource {
  id: number;
  sensorName: string;
  type: string;
  unit: string;
  calibrationDate: string;
  isActive: boolean;
  status?: string;
  lastConnected?: string;
  laboratoryId?: number;
  laboratoryName?: string;
  equipmentId?: number;
  equipmentName?: string;
  minThreshold?: number;
  maxThreshold?: number;
  warningThreshold?: number;
}

export interface SensorConfigurationsResponse extends BaseResponse {
  sensorConfigurations: SensorConfigurationResource[];
}
