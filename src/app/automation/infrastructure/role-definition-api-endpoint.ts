import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { RoleDefinition } from '../domain/model/role-definition.entity';
import { RoleDefinitionResource, RoleDefinitionsResponse } from './role-definition-response';
import { RoleDefinitionAssembler } from './role-definition-assembler';

const roleDefinitionsEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAutomationRoleDefinitionsEndpointPath}`;

export class RoleDefinitionsApiEndpoint extends BaseApiEndpoint<RoleDefinition, RoleDefinitionResource, RoleDefinitionsResponse, RoleDefinitionAssembler> {
  constructor(http: HttpClient) {
    super(http, roleDefinitionsEndpointUrl, new RoleDefinitionAssembler());
  }
}
