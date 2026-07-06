import { Component, input } from '@angular/core';
import { Laboratory } from '../../../../../domain/model/laboratory.entity';
import { StatusBadgeComponent } from '../../../../../../shared/presentation/components/status-badge/status-badge.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-laboratory-stats',
  imports: [StatusBadgeComponent, TranslatePipe],
  templateUrl: './laboratory-stats.component.html',
  styleUrls: ['./laboratory-stats.component.css'],
})
export class LaboratoryStatsComponent {
  lab = input.required<Laboratory>();
}
