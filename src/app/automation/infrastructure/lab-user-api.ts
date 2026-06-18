import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { LabUser } from '../domain/model/lab-user.entity';
import { LabUsersApiEndpoint } from './lab-user-api-endpoint';

@Injectable({ providedIn: 'root' })
export class LabUsersApi extends BaseApi {
  private readonly labUsersEndpoint: LabUsersApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.labUsersEndpoint = new LabUsersApiEndpoint(http);
  }

  getLabUsers(): Observable<LabUser[]> {
    return this.labUsersEndpoint.getAll();
  }
}
