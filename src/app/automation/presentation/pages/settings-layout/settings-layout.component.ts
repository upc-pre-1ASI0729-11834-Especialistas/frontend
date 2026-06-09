import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SecondarySidebarComponent, SecondarySidebarItem } from '../../../../shared/presentation/layout/secondary-sidebar/secondary-sidebar';

@Component({
  selector: 'app-settings-layout',
  standalone: true,
  imports: [RouterOutlet, SecondarySidebarComponent],
  templateUrl: './settings-layout.component.html',
  styleUrl: './settings-layout.component.css'
})
export class SettingsLayoutComponent {
  readonly settingsSidebarItems: SecondarySidebarItem[] = [
    {
      label: 'Sensores',
      route: '/settings/sensor-configuration',
      icon: 'sensors'
    },
    {
      label: 'Alertas',
      route: '/settings/alerts-notifications',
      icon: 'notifications'
    },
    {
      label: 'Seguridad',
      route: '/settings/security-access',
      icon: 'lock'
    }
  ];
}
