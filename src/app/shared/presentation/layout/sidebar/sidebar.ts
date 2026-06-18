import { Component, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserProfileStore } from '../../../../automation/application/user-profile.store';
import { AlertsStore } from '../../../../alerts/application/alerts.store';
import { CommonModule } from '@angular/common';

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
  imports: [RouterModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})

export class Sidebar {
  private readonly userProfileStore = inject(UserProfileStore);
  private readonly alertsStore = inject(AlertsStore);

  readonly currentProfile = this.userProfileStore.currentProfile;
  
  readonly userInitials = computed(() => {
    const profile = this.currentProfile();
    if (!profile) return 'AV';
    const cleanName = profile.fullName.replace(/Dr\.\s+/i, '').trim();
    const parts = cleanName.split(/\s+/);
    const first = parts[0]?.charAt(0) || '';
    const last = parts[parts.length - 1]?.charAt(0) || '';
    return (first + last).toUpperCase() || 'AV';
  });

  readonly activeAlertsCount = computed(() => {
    return this.alertsStore.alerts().filter(a => a.status.toLowerCase() !== 'resolved').length;
  });

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
