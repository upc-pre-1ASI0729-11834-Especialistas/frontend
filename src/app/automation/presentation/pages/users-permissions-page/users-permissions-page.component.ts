import { Component, inject, DestroyRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutomationStore } from '../../../application/automation.store';
import { ActiveUsersTableComponent } from '../../components/active-users-table/active-users-table.component';
import { PendingInvitationsCardComponent } from '../../components/pending-invitations-card/pending-invitations-card.component';
import { RoleDefinitionsPanelComponent } from '../../components/role-definitions-panel/role-definitions-panel.component';
import { TopbarActionService } from '../../../../shared/application/topbar-action.service';
import { InviteUserDialog } from '../../components/invite-user-dialog/invite-user-dialog';

@Component({
  selector: 'app-users-permissions-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ActiveUsersTableComponent,
    PendingInvitationsCardComponent,
    RoleDefinitionsPanelComponent
  ],
  templateUrl: './users-permissions-page.component.html',
  styleUrl: './users-permissions-page.component.css'
})
export class UsersPermissionsPageComponent {
  protected readonly automationStore = inject(AutomationStore);
  private readonly dialog = inject(MatDialog);
  private readonly topbarActionService = inject(TopbarActionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.topbarActionService.actionClicked$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.openInviteDialog();
      });
  }

  openInviteDialog(): void {
    const dialogRef = this.dialog.open(InviteUserDialog, {
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '400px',
      panelClass: 'side-sheet-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.automationStore.inviteUser(result.email, result.role).subscribe({
          next: (res) => {
            console.log('Successfully invited:', res);
          },
          error: (err) => {
            console.error('Error inviting user:', err);
          }
        });
      }
    });
  }
}
