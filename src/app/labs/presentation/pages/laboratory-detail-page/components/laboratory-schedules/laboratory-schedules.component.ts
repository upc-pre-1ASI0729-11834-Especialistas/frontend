import { MatIcon } from '@angular/material/icon';
import { Component, input } from '@angular/core';
import { LabSchedule } from '../../../../../domain/model/laboratory.entity';
import { CardComponent } from '../../../../../../shared/presentation/components/card/card.component';
import { IconBadgeComponent } from '../../../../../../shared/presentation/components/icon-badge/icon-badge.component';

@Component({
  selector: 'app-laboratory-schedules',
  imports: [MatIcon, CardComponent, IconBadgeComponent],
  templateUrl: './laboratory-schedules.component.html',
  styleUrl: './laboratory-schedules.component.css',
})
export class LaboratorySchedulesComponent {
  schedules = input.required<LabSchedule[]>();
}
