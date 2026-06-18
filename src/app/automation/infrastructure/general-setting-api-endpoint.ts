import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment.delevopment';
import { GeneralSetting } from '../domain/model/general-setting.entity';
import { GeneralSettingResource, GeneralSettingsResponse } from './general-setting-response';
import { GeneralSettingAssembler } from './general-setting-assembler';

const generalSettingsEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAutomationGeneralSettingsEndpointPath}`;

export class GeneralSettingsApiEndpoint extends BaseApiEndpoint<GeneralSetting, GeneralSettingResource, GeneralSettingsResponse, GeneralSettingAssembler> {
  constructor(http: HttpClient) {
    super(http, generalSettingsEndpointUrl, new GeneralSettingAssembler());
  }
}
