import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Laboratory } from '../domain/model/laboratory.entity';
import { LaboratoryResource, LaboratoryResponse } from './laboratory-response';
import { LaboratoryAssembler } from './laboratory-assembler';

export class LaboratoryApiEndpoint extends BaseApiEndpoint<
  Laboratory,
  LaboratoryResource,
  LaboratoryResponse,
  LaboratoryAssembler
> {
  constructor(http: HttpClient, endpointUrl: string) {
    super(http, endpointUrl, new LaboratoryAssembler());
  }
}
