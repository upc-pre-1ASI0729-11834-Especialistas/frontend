import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface SecurityAccessResource extends BaseResource {
  id: number;
  permission: string;
  role: string;
  isGranted: boolean;
  lastAuditDate: string;
}

export interface SecurityAccessesResponse extends BaseResponse {
  securityAccesses: SecurityAccessResource[];
}
