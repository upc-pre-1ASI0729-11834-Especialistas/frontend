import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {HttpClient} from '@angular/common/http';
import { Alert } from '../domain/model/alert.entity';
import { AlertResource, AlertsResponse } from './alerts-response';
import { AlertAssembler } from './alert-assembler';
import { environment } from '../../../environments/environment';

const alertsEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAlertsEndpointPath}`;

export class AlertsApiEndpoint extends BaseApiEndpoint<Alert, AlertResource, AlertsResponse, AlertAssembler> {
  constructor(http: HttpClient) {
    super(http, alertsEndpointUrl, new AlertAssembler());
  }
}
