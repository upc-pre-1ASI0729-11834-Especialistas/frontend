import { Component, inject, DestroyRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutomationStore } from '../../../application/automation.store';
import { WorkspaceStore } from '../../../../shared/application/workspace.store';
import { ActiveUsersTableComponent } from '../../components/active-users-table/active-users-table.component';
import { PendingInvitationsCardComponent } from '../../components/pending-invitations-card/pending-invitations-card.component';
import { RoleDefinitionsPanelComponent } from '../../components/role-definitions-panel/role-definitions-panel.component';
import { TopbarActionService } from '../../../../shared/application/topbar-action.service';
import { InviteUserDialog } from '../../components/invite-user-dialog/invite-user-dialog';
import { EditPermissionsDialog } from '../../components/edit-permissions-dialog/edit-permissions-dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users-permissions-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ActiveUsersTableComponent,
    PendingInvitationsCardComponent,
    RoleDefinitionsPanelComponent,
    TranslateModule
  ],
  templateUrl: './users-permissions-page.component.html',
  styleUrl: './users-permissions-page.component.css'
})
export class UsersPermissionsPageComponent {
  protected readonly workspaceStore = inject(WorkspaceStore);
  protected readonly automationStore = inject(AutomationStore);
  private readonly dialog = inject(MatDialog);
  private readonly topbarActionService = inject(TopbarActionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);

  constructor() {
    this.topbarActionService.setAction({
      label: this.translateService.instant('settingsPage.usersPermissions.inviteUser') || 'Invite New User',
      icon: 'person_add',
      id: 'invite-user-action'
    });

    this.translateService.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.topbarActionService.setAction({
        label: this.translateService.instant('settingsPage.usersPermissions.inviteUser') || 'Invite New User',
        icon: 'person_add',
        id: 'invite-user-action'
      });
    });

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
        this.automationStore.inviteUser(result.email, result.role, result.laboratoryIds).subscribe({
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

  cancelInvitation(id: number): void {
    this.automationStore.cancelInvitation(id).subscribe({
      next: () => console.log('Successfully cancelled invitation:', id),
      error: (err) => console.error('Error cancelling invitation:', err)
    });
  }

  resendInvitation(id: number): void {
    this.automationStore.resendInvitation(id).subscribe({
      next: (res) => console.log('Successfully resent invitation:', res),
      error: (err) => console.error('Error resending invitation:', err)
    });
  }

  onEditPermissions(userId: number): void {
    const user = this.automationStore.labUsers().find(u => u.id === userId);
    if (!user) {
      console.error('User not found:', userId);
      return;
    }
    const profile = this.automationStore.userProfiles().find(p => p.email.toLowerCase() === user.email.toLowerCase());
    if (!profile) {
      console.error('UserProfile not found for email:', user.email);
      return;
    }

    const dialogRef = this.dialog.open(EditPermissionsDialog, {
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '400px',
      panelClass: 'side-sheet-dialog',
      data: profile
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        profile.role = result.role;
        profile.laboratoryIds = result.laboratoryIds;
        this.automationStore.updateUserProfile(profile.id, profile).subscribe({
          next: () => {
            console.log('Successfully updated user permissions');
            this.automationStore.loadLabUsers();
          },
          error: (err) => console.error('Failed to update user permissions:', err)
        });
      }
    });
  }

  acceptInvitation(id: number): void {
    this.automationStore.acceptInvitation(id).subscribe({
      next: () => console.log('Accepted invitation:', id),
      error: (err) => console.error('Failed to accept:', err)
    });
  }

  rejectInvitation(id: number): void {
    this.automationStore.rejectInvitation(id).subscribe({
      next: () => console.log('Rejected invitation:', id),
      error: (err) => console.error('Failed to reject:', err)
    });
  }

  updateWorkspaceName(name: string): void {
    const active = this.workspaceStore.activeWorkspace();
    if (active && name.trim()) {
      this.workspaceStore.updateWorkspaceName(active.id, name.trim()).subscribe({
        next: () => console.log('Workspace name updated successfully'),
        error: (err) => console.error('Failed to update workspace name:', err)
      });
    }
  }
}
