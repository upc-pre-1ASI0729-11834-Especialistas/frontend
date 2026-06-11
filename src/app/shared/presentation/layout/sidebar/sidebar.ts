import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

interface NavItem {
  label: string;
  route: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})

export class Sidebar {
  navSections: NavSection[] = [
    {
      title: 'MAIN MENU',
      items: [
        { label: 'Dashboard', route: '/dashboard' },
        { label: 'Laboratories', route: '/laboratories' },
        { label: 'Alerts', route: '/alerts' },
        { label: 'History', route: '/history' }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Settings', route: '/settings' }
      ]
    }
  ];
}
