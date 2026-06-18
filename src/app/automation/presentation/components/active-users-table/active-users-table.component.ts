import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { RoleBadgeComponent } from '../role-badge/role-badge.component';
import { LabUser } from '../../../domain/model/lab-user.entity';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-active-users-table',
  standalone: true,
  imports: [MatCardModule, UserAvatarComponent, RoleBadgeComponent, TranslatePipe],
  templateUrl: './active-users-table.component.html',
  styleUrl: './active-users-table.component.css'
})
export class ActiveUsersTableComponent {
  @Input() users: LabUser[] = [];
  @Input() totalCount: number = 0;
}
