import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface NotificationPreferenceResource extends BaseResource {
  id: number;
  channel: string;
  isEnabled: boolean;
  threshold: string;
  description: string;
}

export interface NotificationPreferencesResponse extends BaseResponse {
  notificationPreferences: NotificationPreferenceResource[];
}
