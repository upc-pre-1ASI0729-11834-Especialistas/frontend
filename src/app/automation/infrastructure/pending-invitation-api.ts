import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { PendingInvitation } from '../domain/model/pending-invitation.entity';
import { PendingInvitationsApiEndpoint } from './pending-invitation-api-endpoint';

@Injectable({ providedIn: 'root' })
export class PendingInvitationsApi extends BaseApi {
  private readonly pendingInvitationsEndpoint: PendingInvitationsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.pendingInvitationsEndpoint = new PendingInvitationsApiEndpoint(http);
  }

  getPendingInvitations(): Observable<PendingInvitation[]> {
    return this.pendingInvitationsEndpoint.getAll();
  }

  createPendingInvitation(invitation: PendingInvitation): Observable<PendingInvitation> {
    return this.pendingInvitationsEndpoint.create(invitation);
  }
}
