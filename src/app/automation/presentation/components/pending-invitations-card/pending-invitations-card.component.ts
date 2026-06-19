import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PendingInvitation } from '../../../domain/model/pending-invitation.entity';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pending-invitations-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './pending-invitations-card.component.html',
  styleUrl: './pending-invitations-card.component.css'
})
export class PendingInvitationsCardComponent {
  @Input() invitations: PendingInvitation[] = [];
  @Input() totalCount: number = 0;

  @Output() cancel = new EventEmitter<number>();
  @Output() resend = new EventEmitter<number>();
}
