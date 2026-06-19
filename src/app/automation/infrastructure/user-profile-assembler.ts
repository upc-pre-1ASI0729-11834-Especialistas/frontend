import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { UserProfile } from '../domain/model/user-profile.entity';
import { UserProfileResource, UserProfilesResponse } from './user-profile-response';

export class UserProfileAssembler implements BaseAssembler<UserProfile, UserProfileResource, UserProfilesResponse> {
  toEntitiesFromResponse(response: UserProfilesResponse): UserProfile[] {
    const resources = response.userProfiles || (response as any) || [];
    return resources.map((resource: any) => this.toEntityFromResource(resource as UserProfileResource));
  }

  toEntityFromResource(resource: UserProfileResource): UserProfile {
    return new UserProfile({
      id: resource.id,
      fullName: resource.fullName,
      role: resource.role,
      email: resource.email,
      avatarUrl: resource.avatarUrl,
      phoneNumber: resource.phoneNumber,
      professionalTitle: resource.professionalTitle,
      employeeId: resource.employeeId,
      systemState: resource.systemState,
      accessTier: resource.accessTier,
      defaultStartShift: resource.defaultStartShift,
      shiftDuration: resource.shiftDuration,
      autoGenerateShiftReport: resource.autoGenerateShiftReport,
      laboratoryIds: resource.laboratoryIds,
    });
  }

  toResourceFromEntity(entity: UserProfile): UserProfileResource {
    return {
      id: entity.id,
      fullName: entity.fullName,
      role: entity.role,
      email: entity.email,
      avatarUrl: entity.avatarUrl,
      phoneNumber: entity.phoneNumber,
      professionalTitle: entity.professionalTitle,
      employeeId: entity.employeeId,
      systemState: entity.systemState,
      accessTier: entity.accessTier,
      defaultStartShift: entity.defaultStartShift,
      shiftDuration: entity.shiftDuration,
      autoGenerateShiftReport: entity.autoGenerateShiftReport,
      laboratoryIds: entity.laboratoryIds,
    } as UserProfileResource;
  }
}
