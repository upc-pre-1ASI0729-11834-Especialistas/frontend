import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface LaboratoryResource extends BaseResource {
  id: number;
  name: string;
  type: string;
  temperature: number;
  status: 'ALERT' | 'WARNING' | 'NORMAL';
}

export interface LaboratoryResponse extends BaseResponse {
  laboratories: LaboratoryResource[];
}
