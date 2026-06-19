import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { PendingInvitation } from '../domain/model/pending-invitation.entity';
import { PendingInvitationsApiEndpoint } from './pending-invitation-api-endpoint';

@Injectable({ providedIn: 'root' })
export class PendingInvitationsApi extends BaseApi {
  private readonly pendingInvitationsEndpoint: PendingInvitationsApiEndpoint;

  constructor(private readonly http: HttpClient) {
    super();
    this.pendingInvitationsEndpoint = new PendingInvitationsApiEndpoint(http);
  }

  getPendingInvitations(): Observable<PendingInvitation[]> {
    return this.pendingInvitationsEndpoint.getAll();
  }

  createPendingInvitation(invitation: PendingInvitation): Observable<PendingInvitation> {
    return this.pendingInvitationsEndpoint.create(invitation);
  }

  deletePendingInvitation(id: number): Observable<void> {
    return this.pendingInvitationsEndpoint.delete(id);
  }

  resendPendingInvitation(id: number): Observable<PendingInvitation> {
    const endpointUrl = this.pendingInvitationsEndpoint['endpointUrl'];
    return this.http.post<any>(`${endpointUrl}/${id}/resend`, {}).pipe(
      map(res => this.pendingInvitationsEndpoint['assembler'].toEntityFromResource(res))
    );
  }

  getMyInvitations(): Observable<PendingInvitation[]> {
    const endpointUrl = this.pendingInvitationsEndpoint['endpointUrl'];
    return this.http.get<any[]>(`${endpointUrl}/my-invitations`).pipe(
      map(res => res.map(item => this.pendingInvitationsEndpoint['assembler'].toEntityFromResource(item)))
    );
  }

  acceptInvitation(id: number): Observable<void> {
    const endpointUrl = this.pendingInvitationsEndpoint['endpointUrl'];
    return this.http.post<void>(`${endpointUrl}/${id}/accept`, {});
  }

  rejectInvitation(id: number): Observable<void> {
    const endpointUrl = this.pendingInvitationsEndpoint['endpointUrl'];
    return this.http.post<void>(`${endpointUrl}/${id}/reject`, {});
  }
}
