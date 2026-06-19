import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { NotificationPreference } from '../domain/model/notification-preference.entity';
import { NotificationPreferencesApiEndpoint } from './notification-preference-api-endpoint';

@Injectable({ providedIn: 'root' })
export class NotificationPreferencesApi extends BaseApi {
  private readonly notificationPreferencesEndpoint: NotificationPreferencesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.notificationPreferencesEndpoint = new NotificationPreferencesApiEndpoint(http);
  }

  getNotificationPreferences(): Observable<NotificationPreference[]> {
    return this.notificationPreferencesEndpoint.getAll();
  }

  updateNotificationPreference(id: number, preference: NotificationPreference): Observable<NotificationPreference> {
    return this.notificationPreferencesEndpoint.update(preference, id);
  }
}
