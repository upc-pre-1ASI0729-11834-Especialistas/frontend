import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { TemperatureReading } from '../domain/model/temperature-reading.entity';
import { TemperatureReadingResource, TemperatureReadingResponse } from './temperature-reading-response';
import { TemperatureReadingAssembler } from './temperature-reading.assembler';
import { environment } from '../../../environments/environment.delevopment';

const temperatureReadingsEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderTelemetryTemperatureReadingsEndpointPath}`;

export class TemperatureReadingApiEndpoint extends BaseApiEndpoint<TemperatureReading, TemperatureReadingResource, TemperatureReadingResponse, TemperatureReadingAssembler> {
  constructor(http: HttpClient) {
    super(http, temperatureReadingsEndpointUrl, new TemperatureReadingAssembler());
  }
}
