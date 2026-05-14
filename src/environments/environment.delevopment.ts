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

  // Automation module endpoints
  platformProviderAutomationGeneralSettingsEndpointPath: '/general-settings',
  platformProviderAutomationUserProfilesEndpointPath: '/user-profiles',
  platformProviderAutomationSensorConfigurationsEndpointPath: '/sensor-configurations',
  platformProviderAutomationNotificationPreferencesEndpointPath: '/notification-preferences',
  platformProviderAutomationSecurityAccessesEndpointPath: '/security-accesses',
};
