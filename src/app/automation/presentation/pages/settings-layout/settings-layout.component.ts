import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SecondarySidebarComponent, SecondarySidebarItem } from '../../../../shared/presentation/layout/secondary-sidebar/secondary-sidebar';

@Component({
  selector: 'app-settings-layout',
  standalone: true,
  imports: [RouterOutlet, SecondarySidebarComponent],
  templateUrl: './settings-layout.component.html',
  styleUrls: ['./settings-layout.component.css']
})
export class SettingsLayoutComponent {
  readonly settingsSidebarItems: SecondarySidebarItem[] = [
    {
      label: 'Profile',
      route: '/settings/profile-identity',
      icon: 'badge'
    },
    {
      label: 'Sensors',
      route: '/settings/sensor-configuration',
      icon: 'sensors'
    },
    {
      label: 'Equipment',
      route: '/settings/threshold-configuration',
      icon: 'biotech'
    },
    {
      label: 'Metric Types',
      route: '/settings/metric-types',
      icon: 'category'
    },

    {
      label: 'Alerts',
      route: '/settings/alerts-notifications',
      icon: 'notifications'
    },
    {
      label: 'Security',
      route: '/settings/security-access',
      icon: 'lock'
    },
    {
      label: 'Users',
      route: '/settings/users-permissions',
      icon: 'people'
    },
    {
      label: 'Automation',
      route: '/settings/automation-rules',
      icon: 'settings_suggest'
    }
  ];
}
