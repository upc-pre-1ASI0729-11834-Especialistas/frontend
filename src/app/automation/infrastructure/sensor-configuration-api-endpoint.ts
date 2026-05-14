import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment.delevopment';
import { SensorConfiguration } from '../domain/model/sensor-configuration.entity';
import { SensorConfigurationResource, SensorConfigurationsResponse } from './sensor-configuration-response';
import { SensorConfigurationAssembler } from './sensor-configuration-assembler';

const sensorConfigurationsEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAutomationSensorConfigurationsEndpointPath}`;

export class SensorConfigurationsApiEndpoint extends BaseApiEndpoint<SensorConfiguration, SensorConfigurationResource, SensorConfigurationsResponse, SensorConfigurationAssembler> {
  constructor(http: HttpClient) {
    super(http, sensorConfigurationsEndpointUrl, new SensorConfigurationAssembler());
  }
}
