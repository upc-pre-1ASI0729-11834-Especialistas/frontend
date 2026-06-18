import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { UserProfile } from '../domain/model/user-profile.entity';
import { UserProfileResource, UserProfilesResponse } from './user-profile-response';

export class UserProfileAssembler implements BaseAssembler<UserProfile, UserProfileResource, UserProfilesResponse> {
  toEntitiesFromResponse(response: UserProfilesResponse): UserProfile[] {
    return response.userProfiles.map(resource => this.toEntityFromResource(resource as UserProfileResource));
  }

  toEntityFromResource(resource: UserProfileResource): UserProfile {
    return new UserProfile({
      id: resource.id,
      fullName: resource.fullName,
      role: resource.role,
      email: resource.email,
      avatarUrl: resource.avatarUrl,
    });
  }

  toResourceFromEntity(entity: UserProfile): UserProfileResource {
    return {
      id: entity.id,
      fullName: entity.fullName,
      role: entity.role,
      email: entity.email,
      avatarUrl: entity.avatarUrl,
    } as UserProfileResource;
  }
}
