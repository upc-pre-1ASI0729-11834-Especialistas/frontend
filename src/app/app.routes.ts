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
import { authGuard } from './iam/infrastructure/authentication.guard';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
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
          title: 'Dashboard',
          subtitle: 'Overview of all laboratory environments'
        }
      },
      {
        path: 'dashboard',
        component: DashboardPageComponent,
        data: {
          title: 'Dashboard',
          subtitle: 'Overview of all laboratory environments'
        }
      },
      {
        path: 'laboratories',
        children: [
          {
            path: '',
            component: LaboratoriesPageComponent,
            data: {
              title: 'Laboratories',
              subtitle: 'Manage and monitor laboratory environments'
            }
          },
          {
            path: 'add',
            component: AddLaboratoryPageComponent,
            data: {
              title: 'Add Laboratory',
              subtitle: 'Register a new laboratory in the system'
            }
          },
          {
            path: ':id/edit',
            component: AddLaboratoryPageComponent,
            data: {
              title: 'Edit Laboratory',
              subtitle: 'Modify laboratory configuration and details'
            }
          },
          {
            path: ':id',
            component: LaboratoryDetailPageComponent,
            data: {
              title: 'Laboratory Details',
              subtitle: 'Detailed information and metrics'
            }
          }
        ]
      },
      {
        path: 'alerts',
        component: AlertsPage,
        data: {
          title: 'Alerts',
          subtitle: 'View and manage system alerts'
        }
      },
      {
        path: 'alerts/incident',
        component: IncidentViewPage,
        data: {
          title: 'Alerts',
          subtitle: 'Active incidents and notifications'
        }
      },
      {
        path: 'history',
        component: HistoryPage,
        data: {
          title: 'History',
          subtitle: 'View system activity and logs'
        }
      },
      {
        path: 'reports',
        component: AlertsPage,
        data: {
          title: 'Reports',
          subtitle: 'Generate and view system reports'
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
              title: 'Sensor Configuration',
              subtitle: 'Calibrate and manage lab sensors for temperature, humidity, and atmospheric pressure monitoring.'
            }
          },
          {
            path: 'metric-types',
            component: MetricTypesPageComponent,
            data: {
              title: 'Metric Types',
              subtitle: 'Define and manage standard sensor metric types, units, icons, and categories.'
            }
          },
          {
            path: 'profile-identity',
            component: ProfileIdentityPageComponent,
            data: {
              title: 'Profile & Identity',
              subtitle: 'Manage your personal information and professional credentials.'
            }
          },
          {
            path: 'alerts-notifications',
            component: AlertsNotificationsPageComponent,
            data: {
              title: 'Alerts & Notifications',
              subtitle: 'Configure how and when you receive laboratory safety and status updates.'
            }
          },
          {
            path: 'security-access',
            component: SecurityAccessPageComponent,
            data: {
              title: 'Security & Access',
              subtitle: 'Manage your account credentials and security preferences.'
            }
          },
          {
            path: 'users-permissions',
            component: UsersPermissionsPageComponent,
            data: {
              title: 'Users & Permissions',
              subtitle: 'Control who has access to SafeLab and what they can do.',
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
              title: 'Threshold Configuration',
              subtitle: 'Define temperature and environmental limits for each equipment.'
            }
          },
          {
            path: 'automation-rules',
            component: AutomationRulesPageComponent,
            data: {
              title: 'Automation Rules',
              subtitle: 'Define how the system responds automatically to environmental events.',
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
          title: 'Resolve Incident',
          subtitle: 'Log resolution details for the active incident'
        }
      }
    ]
  }
];

