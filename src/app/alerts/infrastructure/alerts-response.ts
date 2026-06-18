import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface AlertResource extends BaseResource {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
}

export interface AlertsResponse extends BaseResponse {
  alerts: AlertResource[];
}
