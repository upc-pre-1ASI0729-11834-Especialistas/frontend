import { Component, inject, computed } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AutomationStore } from '../../../application/automation.store';
import { SettingsCardComponent } from '../../components/settings-card/settings-card.component';
import { UserProfileCardComponent } from '../../components/user-profile-card/user-profile-card.component';
import { UserProfile } from '../../../domain/model/user-profile.entity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    SettingsCardComponent,
    UserProfileCardComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent {
  protected readonly automationStore = inject(AutomationStore);
  private readonly router = inject(Router);

  private readonly defaultProfile = new UserProfile({
    id: 0,
    fullName: 'John Doe',
    role: 'Senior Lab Manager',
    email: 'john.doe@safelab.io',
    avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=1976d2&color=fff&size=128'
  });

  readonly displayProfile = computed(() =>
    this.automationStore.currentProfile() ?? this.defaultProfile
  );

  navigateToSensorConfig(): void {
    this.router.navigate(['/settings/sensor-configuration']);
  }

  navigateToAlertsNotifications(): void {
    this.router.navigate(['/settings/alerts-notifications']);
  }

  navigateToSecurityAccess(): void {
    this.router.navigate(['/settings/security-access']);
  }
}
