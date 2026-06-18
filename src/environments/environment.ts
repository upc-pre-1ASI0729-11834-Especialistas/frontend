export const environment = {
  production: true,
  platformProviderApiBaseUrl: 'https://fake-api-production-0033.up.railway.app',
  platformProviderAuthenticationEndpointPath: '/api/v1/authentication',
  platformProviderAlertsEndpointPath: '/alerts',

  platformProviderTelemetryAlertsEndpointPath: '/telemetry-alerts',
  platformProviderTelemetryLaboratoriesEndpointPath: '/telemetry-laboratories',
  platformProviderTelemetryStatsEndpointPath: '/telemetry-stats',
  platformProviderTelemetryTemperatureReadingsEndpointPath: '/telemetry-temperature-readings',
  platformProviderTelemetryMetricTypesEndpointPath: '/api/v1/metric-types',

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
  platformProviderAutomationAutomationRulesEndpointPath: '/automation-rules',
  platformProviderSystemStatusEndpointPath: '/system/status',
};
