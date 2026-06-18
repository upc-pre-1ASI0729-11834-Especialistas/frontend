import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { LabUser } from '../domain/model/lab-user.entity';
import { LabUserResource, LabUsersResponse } from './lab-user-response';

export class LabUserAssembler implements BaseAssembler<LabUser, LabUserResource, LabUsersResponse> {
  toEntitiesFromResponse(response: LabUsersResponse): LabUser[] {
    return response.labUsers.map(resource => this.toEntityFromResource(resource as LabUserResource));
  }

  toEntityFromResource(resource: LabUserResource): LabUser {
    return new LabUser({
      id: resource.id,
      fullName: resource.fullName,
      email: resource.email,
      role: resource.role,
      labsAccess: resource.labsAccess,
      lastLogin: resource.lastLogin,
      status: resource.status,
      avatarInitials: resource.avatarInitials,
      avatarColor: resource.avatarColor,
    });
  }

  toResourceFromEntity(entity: LabUser): LabUserResource {
    return {
      id: entity.id,
      fullName: entity.fullName,
      email: entity.email,
      role: entity.role,
      labsAccess: entity.labsAccess,
      lastLogin: entity.lastLogin,
      status: entity.status,
      avatarInitials: entity.avatarInitials,
      avatarColor: entity.avatarColor,
    } as LabUserResource;
  }
}
