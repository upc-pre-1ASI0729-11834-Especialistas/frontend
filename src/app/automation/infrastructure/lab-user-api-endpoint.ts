import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { LabUser } from '../domain/model/lab-user.entity';
import { LabUserResource, LabUsersResponse } from './lab-user-response';
import { LabUserAssembler } from './lab-user-assembler';

const labUsersEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAutomationLabUsersEndpointPath}`;

export class LabUsersApiEndpoint extends BaseApiEndpoint<LabUser, LabUserResource, LabUsersResponse, LabUserAssembler> {
  constructor(http: HttpClient) {
    super(http, labUsersEndpointUrl, new LabUserAssembler());
  }
}
