import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment.delevopment';
import { PendingInvitation } from '../domain/model/pending-invitation.entity';
import { PendingInvitationResource, PendingInvitationsResponse } from './pending-invitation-response';
import { PendingInvitationAssembler } from './pending-invitation-assembler';

const pendingInvitationsEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAutomationPendingInvitationsEndpointPath}`;

export class PendingInvitationsApiEndpoint extends BaseApiEndpoint<PendingInvitation, PendingInvitationResource, PendingInvitationsResponse, PendingInvitationAssembler> {
  constructor(http: HttpClient) {
    super(http, pendingInvitationsEndpointUrl, new PendingInvitationAssembler());
  }
}
