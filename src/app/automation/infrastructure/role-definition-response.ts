import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface RoleDefinitionResource extends BaseResource {
  id: number;
  name: string;
  description: string;
  permissionsCount: number;
}

export interface RoleDefinitionsResponse extends BaseResponse {
  roleDefinitions: RoleDefinitionResource[];
}
