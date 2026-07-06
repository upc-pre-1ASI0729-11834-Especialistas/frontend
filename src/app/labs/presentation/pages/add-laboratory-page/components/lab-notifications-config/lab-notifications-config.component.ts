import { MatIcon } from '@angular/material/icon';
import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationPreferences } from '../../../../../domain/model/laboratory.entity';
import { CardComponent } from '../../../../../../shared/presentation/components/card/card.component';
import { IconBadgeComponent } from '../../../../../../shared/presentation/components/icon-badge/icon-badge.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { SectionHeaderComponent } from '../../../../../../shared/presentation/components/section-header/section-header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-lab-notifications-config',
  imports: [MatIcon, FormsModule, CardComponent, IconBadgeComponent, SectionHeaderComponent, MatCheckbox, MatSlideToggle, TranslateModule],
  templateUrl: './lab-notifications-config.component.html',
  styleUrls: ['']
})
export class LabNotificationsConfigComponent {
  notifications = model.required<NotificationPreferences>();
}
