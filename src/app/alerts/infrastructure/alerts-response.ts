import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface AlertResource extends BaseResource {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  createdAt?: string;
  laboratoryId?: number;
  labName?: string;
  labLocation?: string;
  sensorId?: number;
  sensorName?: string;
  equipmentName?: string;
  metrics?: Array<{ label: string; value: string }>;
}

export interface AlertsResponse extends BaseResponse {
  alerts: AlertResource[];
}
