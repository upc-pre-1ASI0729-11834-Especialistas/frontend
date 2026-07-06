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
import { AutomationRuleStore } from './automation-rule.store';
import { UserProfile } from '../domain/model/user-profile.entity';
import { SensorConfiguration } from '../domain/model/sensor-configuration.entity';
import { EquipmentThreshold } from '../domain/model/equipment-threshold.entity';

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
  private readonly automationRuleStore = inject(AutomationRuleStore);

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
  readonly receivedInvitations = this.pendingInvitationStore.receivedInvitations;
  readonly receivedInvitationsCount = this.pendingInvitationStore.receivedInvitationsCount;
  readonly roleDefinitions = this.roleDefinitionStore.roleDefinitions;
  readonly equipmentThresholds = this.equipmentThresholdStore.equipmentThresholds;
  readonly automationRules = this.automationRuleStore.automationRules;

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
    this.equipmentThresholdStore.loading() ||
    this.automationRuleStore.loading()
  );

  inviteUser(email: string, role: string, laboratoryIds: number[]) {
    return this.pendingInvitationStore.inviteUser(email, role, laboratoryIds);
  }

  cancelInvitation(id: number) {
    return this.pendingInvitationStore.cancelInvitation(id);
  }

  resendInvitation(id: number) {
    return this.pendingInvitationStore.resendInvitation(id);
  }

  acceptInvitation(id: number) {
    return this.pendingInvitationStore.acceptInvitation(id);
  }

  rejectInvitation(id: number) {
    return this.pendingInvitationStore.rejectInvitation(id);
  }

  loadReceivedInvitations() {
    this.pendingInvitationStore.loadReceivedInvitations();
  }

  updateGeneralSetting(id: number, value: string) {
    return this.generalSettingStore.updateGeneralSetting(id, value);
  }

  updateNotificationPreference(id: number, enabled: boolean) {
    return this.notificationPreferenceStore.updateNotificationPreference(id, enabled);
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

  createAutomationRule(data: {
    name: string;
    active: boolean;
    lastTriggered: string | null;
    triggerMetric: string;
    triggerOperator: string;
    triggerValue: number;
    triggerUnit: string;
    triggerDuration: number;
    scope: 'all' | 'specific';
    specificLabId: number | null;
    actions: string[];
    executionLimitMins: number;
    autoResolve: boolean;
  }) {
    return this.automationRuleStore.createAutomationRule(data);
  }

  updateAutomationRule(id: number, data: Partial<{
    name: string;
    active: boolean;
    lastTriggered: string | null;
    triggerMetric: string;
    triggerOperator: string;
    triggerValue: number;
    triggerUnit: string;
    triggerDuration: number;
    scope: 'all' | 'specific';
    specificLabId: number | null;
    actions: string[];
    executionLimitMins: number;
    autoResolve: boolean;
  }>) {
    return this.automationRuleStore.updateAutomationRule(id, data);
  }

  updateUserProfile(id: number, userProfile: UserProfile) {
    return this.userProfileStore.updateUserProfile(id, userProfile);
  }

  createSensorConfiguration(sensor: SensorConfiguration) {
    return this.sensorConfigurationStore.createSensorConfiguration(sensor);
  }

  updateSensorConfiguration(id: number, sensor: SensorConfiguration) {
    return this.sensorConfigurationStore.updateSensorConfiguration(id, sensor);
  }

  calibrateSensor(id: number, certificateId: string, expirationDate: Date, calibratedAt: Date) {
    return this.sensorConfigurationStore.calibrateSensor(id, certificateId, expirationDate, calibratedAt);
  }

  addEquipmentThreshold(newThreshold: EquipmentThreshold) {
    return this.equipmentThresholdStore.addEquipmentThreshold(newThreshold);
  }

  loadLabUsers() {
    this.labUserStore.loadLabUsers();
  }

  loadGeneralSettings() {
    this.generalSettingStore.loadGeneralSettings();
  }

  loadUserProfiles() {
    this.userProfileStore.loadUserProfiles();
  }

  loadSensorConfigurations() {
    this.sensorConfigurationStore.loadSensorConfigurations();
  }

  loadNotificationPreferences() {
    this.notificationPreferenceStore.loadNotificationPreferences();
  }

  loadSecurityAccesses() {
    this.securityAccessStore.loadSecurityAccesses();
  }

  loadPendingInvitations() {
    this.pendingInvitationStore.loadPendingInvitations();
  }

  loadRoleDefinitions() {
    this.roleDefinitionStore.loadRoleDefinitions();
  }

  loadEquipmentThresholds() {
    this.equipmentThresholdStore.loadEquipmentThresholds();
  }

  loadAutomationRules() {
    this.automationRuleStore.loadAutomationRules();
  }
}
