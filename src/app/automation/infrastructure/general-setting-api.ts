import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { GeneralSetting } from '../domain/model/general-setting.entity';
import { GeneralSettingsApiEndpoint } from './general-setting-api-endpoint';

@Injectable({ providedIn: 'root' })
export class GeneralSettingsApi extends BaseApi {
  private readonly generalSettingsEndpoint: GeneralSettingsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.generalSettingsEndpoint = new GeneralSettingsApiEndpoint(http);
  }

  getGeneralSettings(): Observable<GeneralSetting[]> {
    return this.generalSettingsEndpoint.getAll();
  }
}
