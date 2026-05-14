import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface GeneralSettingResource extends BaseResource {
  id: number;
  key: string;
  value: string;
  category: string;
  description: string;
}

export interface GeneralSettingsResponse extends BaseResponse {
  generalSettings: GeneralSettingResource[];
}
