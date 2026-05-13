import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/layout/layout';
import { AlertsPage } from './alerts/presentation/components/alerts-page/alerts-page';
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
        component: AlertsPage,
        data: {
          title: 'Dashboard',
          subtitle: 'Overview of all laboratory environments'
        }
      },
      {
        path: 'laboratories',
        component: AlertsPage,
        data: {
          title: 'Laboratories',
          subtitle: 'Manage and monitor laboratory environments'
        }
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
        component: AlertsPage,
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

