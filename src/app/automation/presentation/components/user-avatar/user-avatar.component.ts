import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.css'
})
export class UserAvatarComponent {
  @Input() initials: string = '';
  @Input() color: string = '#7C4DFF';
}
