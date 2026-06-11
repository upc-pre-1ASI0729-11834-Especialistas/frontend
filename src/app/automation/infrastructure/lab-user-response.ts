import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface LabUserResource extends BaseResource {
  id: number;
  fullName: string;
  email: string;
  role: string;
  labsAccess: string;
  lastLogin: string;
  status: string;
  avatarInitials: string;
  avatarColor: string;
}

export interface LabUsersResponse extends BaseResponse {
  labUsers: LabUserResource[];
}
