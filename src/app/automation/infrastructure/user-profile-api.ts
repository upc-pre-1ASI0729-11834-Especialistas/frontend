import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { UserProfile } from '../domain/model/user-profile.entity';
import { UserProfilesApiEndpoint } from './user-profile-api-endpoint';

@Injectable({ providedIn: 'root' })
export class UserProfilesApi extends BaseApi {
  private readonly userProfilesEndpoint: UserProfilesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.userProfilesEndpoint = new UserProfilesApiEndpoint(http);
  }

  getUserProfiles(): Observable<UserProfile[]> {
    return this.userProfilesEndpoint.getAll();
  }
}
