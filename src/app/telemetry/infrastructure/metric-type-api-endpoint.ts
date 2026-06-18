import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { MetricType } from '../domain/model/metric-type.entity';
import { MetricTypeResource, MetricTypeResponse } from './metric-type-response';
import { MetricTypeAssembler } from './metric-type-assembler';
import { environment } from '../../../environments/environment';

const metricTypesEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderTelemetryMetricTypesEndpointPath}`;

export class MetricTypeApiEndpoint extends BaseApiEndpoint<MetricType, MetricTypeResource, MetricTypeResponse, MetricTypeAssembler> {
  constructor(http: HttpClient) {
    super(http, metricTypesEndpointUrl, new MetricTypeAssembler());
  }
}
