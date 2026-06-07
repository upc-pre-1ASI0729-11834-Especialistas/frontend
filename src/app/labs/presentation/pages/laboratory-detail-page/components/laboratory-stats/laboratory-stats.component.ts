import { Component, input } from '@angular/core';
import { Laboratory } from '../../../../../domain/model/laboratory.entity';
import { StatusBadgeComponent } from '../../../../../../shared/presentation/components/status-badge/status-badge.component';

@Component({
  selector: 'app-laboratory-stats',
  imports: [StatusBadgeComponent],
  templateUrl: './laboratory-stats.component.html',
  styleUrl: './laboratory-stats.component.css',
})
export class LaboratoryStatsComponent {
  lab = input.required<Laboratory>();
}
