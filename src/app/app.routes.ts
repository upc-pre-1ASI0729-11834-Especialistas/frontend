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

export const routes: Routes = [
  {
    path: '',
    component: Layout,
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

