import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { Alert } from '../domain/model/alert.entity';
import { AlertResource, AlertResponse } from './alert-response';
import { AlertAssembler } from './alert.assembler';
import { environment } from '../../../environments/environment';

const alertsEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderTelemetryAlertsEndpointPath}`;

export class AlertApiEndpoint extends BaseApiEndpoint<Alert, AlertResource, AlertResponse, AlertAssembler> {
  constructor(http: HttpClient) {
    super(http, alertsEndpointUrl, new AlertAssembler());
  }
}
