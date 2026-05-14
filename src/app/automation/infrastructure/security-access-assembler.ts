import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { SecurityAccess } from '../domain/model/security-access.entity';
import { SecurityAccessResource, SecurityAccessesResponse } from './security-access-response';

export class SecurityAccessAssembler implements BaseAssembler<SecurityAccess, SecurityAccessResource, SecurityAccessesResponse> {
  toEntitiesFromResponse(response: SecurityAccessesResponse): SecurityAccess[] {
    return response.securityAccesses.map(resource => this.toEntityFromResource(resource as SecurityAccessResource));
  }

  toEntityFromResource(resource: SecurityAccessResource): SecurityAccess {
    return new SecurityAccess({
      id: resource.id,
      permission: resource.permission,
      role: resource.role,
      isGranted: resource.isGranted,
      lastAuditDate: resource.lastAuditDate,
    });
  }

  toResourceFromEntity(entity: SecurityAccess): SecurityAccessResource {
    return {
      id: entity.id,
      permission: entity.permission,
      role: entity.role,
      isGranted: entity.isGranted,
      lastAuditDate: entity.lastAuditDate,
    } as SecurityAccessResource;
  }
}
