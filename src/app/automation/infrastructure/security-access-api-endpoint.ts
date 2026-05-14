import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment.delevopment';
import { SecurityAccess } from '../domain/model/security-access.entity';
import { SecurityAccessResource, SecurityAccessesResponse } from './security-access-response';
import { SecurityAccessAssembler } from './security-access-assembler';

const securityAccessesEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAutomationSecurityAccessesEndpointPath}`;

export class SecurityAccessesApiEndpoint extends BaseApiEndpoint<SecurityAccess, SecurityAccessResource, SecurityAccessesResponse, SecurityAccessAssembler> {
  constructor(http: HttpClient) {
    super(http, securityAccessesEndpointUrl, new SecurityAccessAssembler());
  }
}
