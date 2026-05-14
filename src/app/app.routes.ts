import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/layout/layout';
import { AlertsPage } from './alerts/presentation/components/alerts-page/alerts-page';
import { DashboardPageComponent } from './telemetry/presentation/pages/dashboard-page/dashboard-page.component';
import { LaboratoriesPageComponent } from './labs/presentation/pages/laboratories-page/laboratories-page.component';
import { AddLaboratoryPageComponent } from './labs/presentation/pages/add-laboratory-page/add-laboratory-page.component';
import { LaboratoryDetailPageComponent } from './labs/presentation/pages/laboratory-detail-page/laboratory-detail-page.component';
import { HistoryPage } from './history/presentation/views/history-page/history-page';
import { SettingsPageComponent } from './automation/presentation/pages/settings-page/settings-page.component';
import { SensorConfigurationPageComponent } from './automation/presentation/pages/sensor-configuration-page/sensor-configuration-page.component';
import { AlertsNotificationsPageComponent } from './automation/presentation/pages/alerts-notifications-page/alerts-notifications-page.component';
import { SecurityAccessPageComponent } from './automation/presentation/pages/security-access-page/security-access-page.component';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
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
        component: SettingsPageComponent,
        data: {
          title: 'Settings',
          subtitle: 'Configure your Safelab workspace and personal preferences.'
        }
      },
      {
        path: 'settings/sensor-configuration',
        component: SensorConfigurationPageComponent,
        data: {
          title: 'Settings',
          subtitle: 'Configure your Safelab workspace and personal preferences.'
        }
      },
      {
        path: 'settings/alerts-notifications',
        component: AlertsNotificationsPageComponent,
        data: {
          title: 'Settings',
          subtitle: 'Configure your Safelab workspace and personal preferences.'
        }
      },
      {
        path: 'settings/security-access',
        component: SecurityAccessPageComponent,
        data: {
          title: 'Settings',
          subtitle: 'Configure your Safelab workspace and personal preferences.'
        }
      }
    ]
  }
];

