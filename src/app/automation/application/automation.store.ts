import { inject, Injectable, computed } from '@angular/core';
import { GeneralSettingStore } from './general-setting.store';
import { UserProfileStore } from './user-profile.store';
import { SensorConfigurationStore } from './sensor-configuration.store';
import { NotificationPreferenceStore } from './notification-preference.store';
import { SecurityAccessStore } from './security-acces.store';
import { LabUserStore } from './lab-user.store';
import { PendingInvitationStore } from './pending-invitation.store';
import { RoleDefinitionStore } from './role-definition.store';
import { EquipmentThresholdStore } from './equipment-threshold.store';

@Injectable({ providedIn: 'root' })
export class AutomationStore {
  private readonly generalSettingStore = inject(GeneralSettingStore);
  private readonly userProfileStore = inject(UserProfileStore);
  private readonly sensorConfigurationStore = inject(SensorConfigurationStore);
  private readonly notificationPreferenceStore = inject(NotificationPreferenceStore);
  private readonly securityAccessStore = inject(SecurityAccessStore);
  private readonly labUserStore = inject(LabUserStore);
  private readonly pendingInvitationStore = inject(PendingInvitationStore);
  private readonly roleDefinitionStore = inject(RoleDefinitionStore);
  private readonly equipmentThresholdStore = inject(EquipmentThresholdStore);

  // Delegate signals from individual stores
  readonly generalSettings = this.generalSettingStore.generalSettings;
  readonly userProfiles = this.userProfileStore.userProfiles;
  readonly currentProfile = this.userProfileStore.currentProfile;
  readonly sensorConfigurations = this.sensorConfigurationStore.sensorConfigurations;
  readonly notificationPreferences = this.notificationPreferenceStore.notificationPreferences;
  readonly securityAccesses = this.securityAccessStore.securityAccesses;
  readonly labUsers = this.labUserStore.labUsers;
  readonly labUsersCount = this.labUserStore.labUsersCount;
  readonly activeUsersCount = this.labUserStore.activeUsersCount;
  readonly pendingInvitations = this.pendingInvitationStore.pendingInvitations;
  readonly pendingInvitationsCount = this.pendingInvitationStore.pendingInvitationsCount;
  readonly roleDefinitions = this.roleDefinitionStore.roleDefinitions;
  readonly equipmentThresholds = this.equipmentThresholdStore.equipmentThresholds;

  // Combined loading signal
  readonly loading = computed(() =>
    this.generalSettingStore.loading() ||
    this.userProfileStore.loading() ||
    this.sensorConfigurationStore.loading() ||
    this.notificationPreferenceStore.loading() ||
    this.securityAccessStore.loading() ||
    this.labUserStore.loading() ||
    this.pendingInvitationStore.loading() ||
    this.roleDefinitionStore.loading() ||
    this.equipmentThresholdStore.loading()
  );

  inviteUser(email: string, role: string) {
    return this.pendingInvitationStore.inviteUser(email, role);
  }

  updateEquipmentThreshold(id: number, data: {
    minThreshold?: number;
    maxThreshold?: number;
    warningAt?: number;
    name?: string;
    icon?: string;
    lab?: string;
    unit?: string;
    currentValue?: number;
    status?: string;
  }) {
    return this.equipmentThresholdStore.updateEquipmentThreshold(id, data);
  }
}
