import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface PendingInvitationResource extends BaseResource {
  id: number;
  email: string;
  role: string;
  sentTimeAgo: string;
}

export interface PendingInvitationsResponse extends BaseResponse {
  pendingInvitations: PendingInvitationResource[];
}
