import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { NotificationPreference } from '../domain/model/notification-preference.entity';
import { NotificationPreferenceResource, NotificationPreferencesResponse } from './notification-preference-response';

export class NotificationPreferenceAssembler implements BaseAssembler<NotificationPreference, NotificationPreferenceResource, NotificationPreferencesResponse> {
  toEntitiesFromResponse(response: NotificationPreferencesResponse): NotificationPreference[] {
    return response.notificationPreferences.map(resource => this.toEntityFromResource(resource as NotificationPreferenceResource));
  }

  toEntityFromResource(resource: NotificationPreferenceResource): NotificationPreference {
    return new NotificationPreference({
      id: resource.id,
      channel: resource.channel,
      isEnabled: resource.isEnabled,
      threshold: resource.threshold,
      description: resource.description,
    });
  }

  toResourceFromEntity(entity: NotificationPreference): NotificationPreferenceResource {
    return {
      id: entity.id,
      channel: entity.channel,
      isEnabled: entity.isEnabled,
      threshold: entity.threshold,
      description: entity.description,
    } as NotificationPreferenceResource;
  }
}
