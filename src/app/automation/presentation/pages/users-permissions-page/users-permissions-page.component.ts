import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AutomationStore } from '../../../application/automation.store';
import { ActiveUsersTableComponent } from '../../components/active-users-table/active-users-table.component';
import { PendingInvitationsCardComponent } from '../../components/pending-invitations-card/pending-invitations-card.component';
import { RoleDefinitionsPanelComponent } from '../../components/role-definitions-panel/role-definitions-panel.component';

@Component({
  selector: 'app-users-permissions-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ActiveUsersTableComponent,
    PendingInvitationsCardComponent,
    RoleDefinitionsPanelComponent
  ],
  templateUrl: './users-permissions-page.component.html',
  styleUrl: './users-permissions-page.component.css'
})
export class UsersPermissionsPageComponent {
  protected readonly automationStore = inject(AutomationStore);
}
