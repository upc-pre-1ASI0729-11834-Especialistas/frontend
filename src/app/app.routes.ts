import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/layout/layout';
import { AlertsPage } from './alerts/presentation/components/alerts-page/alerts-page';
import { IncidentViewPage } from './alerts/presentation/pages/incident-view-page/incident-view-page';
import { DashboardPageComponent } from './telemetry/presentation/pages/dashboard-page/dashboard-page.component';
import { LaboratoriesPageComponent } from './labs/presentation/pages/laboratories-page/laboratories-page.component';
import { AddLaboratoryPageComponent } from './labs/presentation/pages/add-laboratory-page/add-laboratory-page.component';
import { LaboratoryDetailPageComponent } from './labs/presentation/pages/laboratory-detail-page/laboratory-detail-page.component';
import { HistoryPage } from './history/presentation/views/history-page/history-page';
import { SettingsLayoutComponent } from './automation/presentation/pages/settings-layout/settings-layout.component';
import { SensorConfigurationPageComponent } from './automation/presentation/pages/sensor-configuration-page/sensor-configuration-page.component';
import { AlertsNotificationsPageComponent } from './automation/presentation/pages/alerts-notifications-page/alerts-notifications-page.component';
import { SecurityAccessPageComponent } from './automation/presentation/pages/security-access-page/security-access-page.component';
import { UsersPermissionsPageComponent } from './automation/presentation/pages/users-permissions-page/users-permissions-page.component';
import { ResolveIncidentPage } from './alerts/presentation/pages/resolve-incident-page/resolve-incident-page';
import { ThresholdConfigurationPageComponent } from './automation/presentation/pages/threshold-configuration-page/threshold-configuration-page.component';
import { AutomationRulesPageComponent } from './automation/presentation/pages/automation-rules-page/automation-rules-page.component';
import { ProfileIdentityPageComponent } from './automation/presentation/pages/profile-identity-page/profile-identity-page.component';
import { MetricTypesPageComponent } from './automation/presentation/pages/metric-types-page/metric-types-page.component';
import { LoginPageComponent } from './iam/presentation/pages/login-page/login-page.component';
import { RegisterPageComponent } from './iam/presentation/pages/register-page/register-page.component';
import { authGuard } from './iam/infrastructure/authentication.guard';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardPageComponent,
        data: {
          title: 'routes.dashboard.title',
          subtitle: 'routes.dashboard.subtitle'
        }
      },
      {
        path: 'dashboard',
        component: DashboardPageComponent,
        data: {
          title: 'routes.dashboard.title',
          subtitle: 'routes.dashboard.subtitle'
        }
      },
      {
        path: 'laboratories',
        children: [
          {
            path: '',
            component: LaboratoriesPageComponent,
            data: {
              title: 'routes.laboratories.title',
              subtitle: 'routes.laboratories.subtitle'
            }
          },
          {
            path: 'add',
            component: AddLaboratoryPageComponent,
            data: {
              title: 'routes.laboratories.add.title',
              subtitle: 'routes.laboratories.add.subtitle'
            }
          },
          {
            path: ':id/edit',
            component: AddLaboratoryPageComponent,
            data: {
              title: 'routes.laboratories.edit.title',
              subtitle: 'routes.laboratories.edit.subtitle'
            }
          },
          {
            path: ':id',
            component: LaboratoryDetailPageComponent,
            data: {
              title: 'routes.laboratories.detail.title',
              subtitle: 'routes.laboratories.detail.subtitle'
            }
          }
        ]
      },
      {
        path: 'alerts',
        component: AlertsPage,
        data: {
          title: 'routes.alerts.title',
          subtitle: 'routes.alerts.subtitle'
        }
      },
      {
        path: 'alerts/incident',
        component: IncidentViewPage,
        data: {
          title: 'routes.alerts.title',
          subtitle: 'routes.alerts.incident.subtitle'
        }
      },
      {
        path: 'history',
        component: HistoryPage,
        data: {
          title: 'routes.history.title',
          subtitle: 'routes.history.subtitle',
          topbarAction: {
            label: 'Generate Shift Report',
            icon: 'picture_as_pdf',
            id: 'generate-report-action'
          }
        }
      },
      {
        path: 'reports',
        component: AlertsPage,
        data: {
          title: 'routes.reports.title',
          subtitle: 'routes.reports.subtitle'
        }
      },
      {
        path: 'settings',
        component: SettingsLayoutComponent,
        children: [
          {
            path: '',
            redirectTo: 'sensor-configuration',
            pathMatch: 'full'
          },
          {
            path: 'sensor-configuration',
            component: SensorConfigurationPageComponent,
            data: {
              title: 'routes.settings.sensor.title',
              subtitle: 'routes.settings.sensor.subtitle',
              topbarAction: {
                label: 'Add New Sensor',
                icon: 'add',
                id: 'add-sensor-action'
              }
            }
          },
          {
            path: 'metric-types',
            component: MetricTypesPageComponent,
            data: {
              title: 'routes.settings.metricTypes.title',
              subtitle: 'routes.settings.metricTypes.subtitle',
              topbarAction: {
                label: 'Add Metric Type',
                icon: 'add',
                id: 'add-metric-type-action'
              }
            }
          },
          {
            path: 'profile-identity',
            component: ProfileIdentityPageComponent,
            data: {
              title: 'routes.settings.profile.title',
              subtitle: 'routes.settings.profile.subtitle'
            }
          },
          {
            path: 'alerts-notifications',
            component: AlertsNotificationsPageComponent,
            data: {
              title: 'routes.settings.alerts.title',
              subtitle: 'routes.settings.alerts.subtitle'
            }
          },
          {
            path: 'security-access',
            component: SecurityAccessPageComponent,
            data: {
              title: 'routes.settings.security.title',
              subtitle: 'routes.settings.security.subtitle'
            }
          },
          {
            path: 'users-permissions',
            component: UsersPermissionsPageComponent,
            data: {
              title: 'routes.settings.users.title',
              subtitle: 'routes.settings.users.subtitle',
              topbarAction: {
                label: 'Invite User',
                icon: 'person_add',
                id: 'invite-user-action'
              }
            }
          },
          {
            path: 'threshold-configuration',
            component: ThresholdConfigurationPageComponent,
            data: {
              title: 'routes.settings.threshold.title',
              subtitle: 'routes.settings.threshold.subtitle'
            }
          },
          {
            path: 'automation-rules',
            component: AutomationRulesPageComponent,
            data: {
              title: 'routes.settings.rules.title',
              subtitle: 'routes.settings.rules.subtitle',
              topbarAction: {
                label: 'Add Rule',
                icon: 'add',
                id: 'add-rule-action'
              }
            }
          }
        ]
      },
      {
        path: 'alerts/incident/resolve',
        component: ResolveIncidentPage,
        data: {
          title: 'routes.resolveIncident.title',
          subtitle: 'routes.resolveIncident.subtitle'
        }
      }
    ]
  }
];

