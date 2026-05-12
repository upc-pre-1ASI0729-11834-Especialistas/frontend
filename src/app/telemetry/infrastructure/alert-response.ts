import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface AlertResource extends BaseResource {
  id: number;
  labName: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'RESOLVED';
  timeAgo: string;
}

export interface AlertResponse extends BaseResponse {
  alerts: AlertResource[];
}
