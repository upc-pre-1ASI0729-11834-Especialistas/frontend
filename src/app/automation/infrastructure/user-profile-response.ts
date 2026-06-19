import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface UserProfileResource extends BaseResource {
  id: number;
  fullName: string;
  role: string;
  email: string;
  avatarUrl: string;
  phoneNumber?: string;
  professionalTitle?: string;
  employeeId?: string;
  systemState?: string;
  accessTier?: string;
  defaultStartShift?: string;
  shiftDuration?: string;
  autoGenerateShiftReport?: boolean;
  laboratoryIds?: number[];
}

export interface UserProfilesResponse extends BaseResponse {
  userProfiles: UserProfileResource[];
}
