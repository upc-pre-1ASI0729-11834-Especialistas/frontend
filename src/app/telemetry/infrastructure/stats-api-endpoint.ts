import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { DashboardStats } from '../domain/model/dashboard-stats.entity';
import { DashboardStatsResource, DashboardStatsResponse } from './stats-response';
import { StatsAssembler } from './stats.assembler';
import { environment } from '../../../environments/environment.delevopment';

const statsEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderTelemetryStatsEndpointPath}`;

export class StatsApiEndpoint extends BaseApiEndpoint<DashboardStats, DashboardStatsResource, DashboardStatsResponse, StatsAssembler> {
  constructor(http: HttpClient) {
    super(http, statsEndpointUrl, new StatsAssembler());
  }
}
