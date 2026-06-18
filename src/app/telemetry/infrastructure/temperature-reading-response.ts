import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface TemperatureReadingResource extends BaseResource {
  id: number;
  date: string;
  values: { [labId: string]: number };
}

export interface TemperatureReadingResponse extends BaseResponse {
  readings: TemperatureReadingResource[];
}
