import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface TemperatureReadingResource extends BaseResource {
  id: number;
  date: string;
  lab01Value: number;
  lab02Value: number;
}

export interface TemperatureReadingResponse extends BaseResponse {
  readings: TemperatureReadingResource[];
}
