import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/layout/layout';
import { AlertsPage } from './alerts/presentation/components/alerts-page/alerts-page';
import { DashboardPageComponent } from './telemetry/presentation/pages/dashboard-page/dashboard-page.component';

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
        component: AlertsPage,
        data: {
          title: 'Settings',
          subtitle: 'Manage system configuration'
        }
      }
    ]
  }
];
