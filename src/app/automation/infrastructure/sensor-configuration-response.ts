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
}

export interface SensorConfigurationsResponse extends BaseResponse {
  sensorConfigurations: SensorConfigurationResource[];
}
