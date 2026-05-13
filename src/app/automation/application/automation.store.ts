import { inject, Injectable, computed } from '@angular/core';
import { GeneralSettingStore } from './general-setting.store';
import { UserProfileStore } from './user-profile.store';
import { SensorConfigurationStore } from './sensor-configuration.store';
import { NotificationPreferenceStore } from './notification-preference';
import { SecurityAccessStore } from './security-access.store';

@Injectable({ providedIn: 'root' })
export class AutomationStore {
  private readonly generalSettingStore = inject(GeneralSettingStore);
  private readonly userProfileStore = inject(UserProfileStore);
  private readonly sensorConfigurationStore = inject(SensorConfigurationStore);
  private readonly notificationPreferenceStore = inject(NotificationPreferenceStore);
  private readonly securityAccessStore = inject(SecurityAccessStore);

  // Delegate signals from individual stores
  readonly generalSettings = this.generalSettingStore.generalSettings;
  readonly userProfiles = this.userProfileStore.userProfiles;
  readonly currentProfile = this.userProfileStore.currentProfile;
  readonly sensorConfigurations = this.sensorConfigurationStore.sensorConfigurations;
  readonly notificationPreferences = this.notificationPreferenceStore.notificationPreferences;
  readonly securityAccesses = this.securityAccessStore.securityAccesses;

  // Combined loading signal
  readonly loading = computed(() =>
    this.generalSettingStore.loading() ||
    this.userProfileStore.loading() ||
    this.sensorConfigurationStore.loading() ||
    this.notificationPreferenceStore.loading() ||
    this.securityAccessStore.loading()
  );
}
