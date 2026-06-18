import { MatIcon } from '@angular/material/icon';
import { Component, input } from '@angular/core';
import { Laboratory } from '../../../../../domain/model/laboratory.entity';
import { CardComponent } from '../../../../../../shared/presentation/components/card/card.component';
import { IconBadgeComponent } from '../../../../../../shared/presentation/components/icon-badge/icon-badge.component';
import { StatusBadgeComponent } from '../../../../../../shared/presentation/components/status-badge/status-badge.component';

@Component({
  selector: 'app-laboratory-stats',
  imports: [MatIcon, CardComponent, IconBadgeComponent, StatusBadgeComponent],
  templateUrl: './laboratory-stats.component.html',
  styleUrl: './laboratory-stats.component.css',
})
export class LaboratoryStatsComponent {
  lab = input.required<Laboratory>();
}
