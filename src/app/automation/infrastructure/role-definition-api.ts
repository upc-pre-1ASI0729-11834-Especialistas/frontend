import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { RoleDefinition } from '../domain/model/role-definition.entity';
import { RoleDefinitionsApiEndpoint } from './role-definition-api-endpoint';

@Injectable({ providedIn: 'root' })
export class RoleDefinitionsApi extends BaseApi {
  private readonly roleDefinitionsEndpoint: RoleDefinitionsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.roleDefinitionsEndpoint = new RoleDefinitionsApiEndpoint(http);
  }

  getRoleDefinitions(): Observable<RoleDefinition[]> {
    return this.roleDefinitionsEndpoint.getAll();
  }
}
