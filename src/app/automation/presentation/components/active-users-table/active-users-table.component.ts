import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { RoleBadgeComponent } from '../role-badge/role-badge.component';
import { LabUser } from '../../../domain/model/lab-user.entity';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-active-users-table',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    UserAvatarComponent,
    RoleBadgeComponent,
    TranslatePipe
  ],
  templateUrl: './active-users-table.component.html',
  styleUrl: './active-users-table.component.css'
})
export class ActiveUsersTableComponent {
  @Input() users: LabUser[] = [];
  @Input() totalCount: number = 0;

  @Output() editPermissions = new EventEmitter<number>();
}
