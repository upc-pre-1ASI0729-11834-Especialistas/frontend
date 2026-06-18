import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface UserProfileResource extends BaseResource {
  id: number;
  fullName: string;
  role: string;
  email: string;
  avatarUrl: string;
}

export interface UserProfilesResponse extends BaseResponse {
  userProfiles: UserProfileResource[];
}
