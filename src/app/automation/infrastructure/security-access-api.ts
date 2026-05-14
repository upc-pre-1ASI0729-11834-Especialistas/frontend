import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { SecurityAccess } from '../domain/model/security-access.entity';
import { SecurityAccessesApiEndpoint } from './security-access-api-endpoint';

@Injectable({ providedIn: 'root' })
export class SecurityAccessesApi extends BaseApi {
  private readonly securityAccessesEndpoint: SecurityAccessesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.securityAccessesEndpoint = new SecurityAccessesApiEndpoint(http);
  }

  getSecurityAccesses(): Observable<SecurityAccess[]> {
    return this.securityAccessesEndpoint.getAll();
  }
}
