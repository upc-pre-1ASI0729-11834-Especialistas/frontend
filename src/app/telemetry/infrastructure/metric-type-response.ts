import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface MetricTypeResource extends BaseResource {
  id: number;
  key: string;
  displayName: string;
  unit: string;
  icon: string;
  category: string;
  active: boolean;
}

export interface MetricTypeResponse extends BaseResponse {
  data: MetricTypeResource[];
}
