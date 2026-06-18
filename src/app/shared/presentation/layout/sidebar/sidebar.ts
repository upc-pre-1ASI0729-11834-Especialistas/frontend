import { Component, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserProfileStore } from '../../../../automation/application/user-profile.store';
import { AlertsStore } from '../../../../alerts/application/alerts.store';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../../../iam/application/auth.store';
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
  imports: [RouterModule, MatIconModule, MatButtonModule, CommonModule, TranslateModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})

export class Sidebar {
  private readonly userProfileStore = inject(UserProfileStore);
  private readonly alertsStore = inject(AlertsStore);
  readonly authStore = inject(AuthStore);

  readonly currentProfile = this.userProfileStore.currentProfile;
  
  readonly userInitials = computed(() => {
    const profile = this.currentProfile();
    if (profile) {
      const cleanName = profile.fullName.replace(/Dr\.\s+/i, '').trim();
      const parts = cleanName.split(/\s+/);
      const first = parts[0]?.charAt(0) || '';
      const last = parts[parts.length - 1]?.charAt(0) || '';
      return (first + last).toUpperCase() || 'AV';
    }
    const currentUserObj = this.authStore.currentUser();
    if (currentUserObj) {
      const emailParts = currentUserObj.email.split('@')[0].split(/[._-]/);
      const first = emailParts[0]?.charAt(0) || '';
      const last = emailParts[emailParts.length - 1]?.charAt(0) || '';
      return (first + last).toUpperCase() || 'US';
    }
    return 'US';
  });

  logout(): void {
    this.authStore.signOut();
  }

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
