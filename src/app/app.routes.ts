import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/layout/layout';
import { AlertsPage } from './alerts/presentation/components/alerts-page/alerts-page';
import { LaboratoriesPageComponent } from './labs/presentation/pages/laboratories-page/laboratories-page.component';
import { AddLaboratoryPageComponent } from './labs/presentation/pages/add-laboratory-page/add-laboratory-page.component';
import { LaboratoryDetailPageComponent } from './labs/presentation/pages/laboratory-detail-page/laboratory-detail-page.component';

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
