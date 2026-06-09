import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { RoleDefinition } from '../domain/model/role-definition.entity';
import { RoleDefinitionResource, RoleDefinitionsResponse } from './role-definition-response';

export class RoleDefinitionAssembler implements BaseAssembler<RoleDefinition, RoleDefinitionResource, RoleDefinitionsResponse> {
  toEntitiesFromResponse(response: RoleDefinitionsResponse): RoleDefinition[] {
    return response.roleDefinitions.map(resource => this.toEntityFromResource(resource as RoleDefinitionResource));
  }

  toEntityFromResource(resource: RoleDefinitionResource): RoleDefinition {
    return new RoleDefinition({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      permissionsCount: resource.permissionsCount,
    });
  }

  toResourceFromEntity(entity: RoleDefinition): RoleDefinitionResource {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      permissionsCount: entity.permissionsCount,
    } as RoleDefinitionResource;
  }
}
