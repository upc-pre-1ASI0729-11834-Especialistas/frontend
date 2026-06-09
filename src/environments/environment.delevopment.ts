export const environment = {
  production: false,
  platformProviderApiBaseUrl: 'http://localhost:3000',
  platformProviderAlertsEndpointPath: '/alerts',

  platformProviderTelemetryAlertsEndpointPath: '/telemetry-alerts',
  platformProviderTelemetryLaboratoriesEndpointPath: '/telemetry-laboratories',
  platformProviderTelemetryStatsEndpointPath: '/telemetry-stats',
  platformProviderTelemetryTemperatureReadingsEndpointPath: '/telemetry-temperature-readings',

  platformProviderLabsEndpointPath: '/labs',

  platformProviderHistoryEndpointPath: '/history',

  platformProviderAutomationGeneralSettingsEndpointPath: '/general-settings',
  platformProviderAutomationUserProfilesEndpointPath: '/user-profiles',
  platformProviderAutomationSensorConfigurationsEndpointPath: '/sensor-configurations',
  platformProviderAutomationNotificationPreferencesEndpointPath: '/notification-preferences',
  platformProviderAutomationSecurityAccessesEndpointPath: '/security-accesses',

  platformProviderAutomationLabUsersEndpointPath: '/lab-users',
  platformProviderAutomationPendingInvitationsEndpointPath: '/pending-invitations',
  platformProviderAutomationRoleDefinitionsEndpointPath: '/role-definitions',
  platformProviderAutomationEquipmentThresholdsEndpointPath: '/equipment-thresholds',
};
