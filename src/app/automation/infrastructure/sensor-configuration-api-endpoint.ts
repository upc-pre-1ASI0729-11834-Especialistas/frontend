import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { SensorConfiguration } from '../domain/model/sensor-configuration.entity';
import { SensorConfigurationResource, SensorConfigurationsResponse } from './sensor-configuration-response';
import { SensorConfigurationAssembler } from './sensor-configuration-assembler';
import { catchError, map, Observable } from 'rxjs';

const sensorConfigurationsEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAutomationSensorConfigurationsEndpointPath}`;

export class SensorConfigurationsApiEndpoint extends BaseApiEndpoint<SensorConfiguration, SensorConfigurationResource, SensorConfigurationsResponse, SensorConfigurationAssembler> {
  constructor(http: HttpClient) {
    super(http, sensorConfigurationsEndpointUrl, new SensorConfigurationAssembler());
  }

  calibrate(id: number, certificateId: string, expirationDate: Date, calibratedAt: Date): Observable<SensorConfiguration> {
    const body = { certificateId, expirationDate, calibratedAt };
    return this.http.post<SensorConfigurationResource>(`${this.endpointUrl}/${id}/calibrate`, body).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to calibrate sensor with id=${id}`))
    );
  }
}
