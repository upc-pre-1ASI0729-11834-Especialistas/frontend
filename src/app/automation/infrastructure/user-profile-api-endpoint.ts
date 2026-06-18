import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../domain/model/user-profile.entity';
import { UserProfileResource, UserProfilesResponse } from './user-profile-response';
import { UserProfileAssembler } from './user-profile-assembler';

const userProfilesEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAutomationUserProfilesEndpointPath}`;

export class UserProfilesApiEndpoint extends BaseApiEndpoint<UserProfile, UserProfileResource, UserProfilesResponse, UserProfileAssembler> {
  constructor(http: HttpClient) {
    super(http, userProfilesEndpointUrl, new UserProfileAssembler());
  }
}
