import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { PendingInvitation } from '../domain/model/pending-invitation.entity';
import { PendingInvitationResource, PendingInvitationsResponse } from './pending-invitation-response';

export class PendingInvitationAssembler implements BaseAssembler<PendingInvitation, PendingInvitationResource, PendingInvitationsResponse> {
  toEntitiesFromResponse(response: PendingInvitationsResponse): PendingInvitation[] {
    return response.pendingInvitations.map(resource => this.toEntityFromResource(resource as PendingInvitationResource));
  }

  toEntityFromResource(resource: PendingInvitationResource): PendingInvitation {
    return new PendingInvitation({
      id: resource.id,
      email: resource.email,
      role: resource.role,
      sentTimeAgo: resource.sentTimeAgo,
    });
  }

  toResourceFromEntity(entity: PendingInvitation): PendingInvitationResource {
    return {
      id: entity.id,
      email: entity.email,
      role: entity.role,
      sentTimeAgo: entity.sentTimeAgo,
    } as PendingInvitationResource;
  }
}
