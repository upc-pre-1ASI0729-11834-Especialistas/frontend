import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { NotificationPreference } from '../domain/model/notification-preference.entity';
import { NotificationPreferenceResource, NotificationPreferencesResponse } from './notification-preference-response';
import { NotificationPreferenceAssembler } from './notification-preference-assembler';

const notificationPreferencesEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAutomationNotificationPreferencesEndpointPath}`;

export class NotificationPreferencesApiEndpoint extends BaseApiEndpoint<NotificationPreference, NotificationPreferenceResource, NotificationPreferencesResponse, NotificationPreferenceAssembler> {
  constructor(http: HttpClient) {
    super(http, notificationPreferencesEndpointUrl, new NotificationPreferenceAssembler());
  }
}
