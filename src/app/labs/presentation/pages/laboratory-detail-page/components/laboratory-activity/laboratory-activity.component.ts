import { MatIcon } from '@angular/material/icon';
import { Component, input } from '@angular/core';
import { LabActivity } from '../../../../../domain/model/laboratory.entity';
import { CardComponent } from '../../../../../../shared/presentation/components/card/card.component';
import { IconBadgeComponent } from '../../../../../../shared/presentation/components/icon-badge/icon-badge.component';

@Component({
  selector: 'app-laboratory-activity',
  imports: [MatIcon, CardComponent, IconBadgeComponent],
  templateUrl: './laboratory-activity.component.html',
  styleUrl: './laboratory-activity.component.css',
})
export class LaboratoryActivityComponent {
  activities = input.required<LabActivity[]>();
}
