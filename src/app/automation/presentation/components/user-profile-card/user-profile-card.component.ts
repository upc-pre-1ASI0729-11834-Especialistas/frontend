import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserProfile } from '../../../domain/model/user-profile.entity';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-profile-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.css']
})
export class UserProfileCardComponent {
  profile = input.required<UserProfile>();

  editProfile = output<UserProfile>();

  onEditProfile(): void {
    this.editProfile.emit(this.profile());
  }
}
