import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { Laboratory } from '../domain/model/laboratory.entity';
import { LaboratoryResource, LaboratoryResponse } from './laboratory-response';
import { LaboratoryAssembler } from './laboratory.assembler';
import { environment } from '../../../environments/environment';

const laboratoriesEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderTelemetryLaboratoriesEndpointPath}`;

export class LaboratoryApiEndpoint extends BaseApiEndpoint<Laboratory, LaboratoryResource, LaboratoryResponse, LaboratoryAssembler> {
  constructor(http: HttpClient) {
    super(http, laboratoriesEndpointUrl, new LaboratoryAssembler());
  }
}
