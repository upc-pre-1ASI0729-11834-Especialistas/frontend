import { Component, input } from '@angular/core';
import { Laboratory } from '../../../../../domain/model/laboratory.entity';
import { StatusBadgeComponent } from '../../../../../../shared/presentation/components/status-badge/status-badge.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-laboratory-header',
  imports: [StatusBadgeComponent, TranslatePipe],
  templateUrl: './laboratory-header.component.html',
  styleUrls: ['./laboratory-header.component.css']
})
export class LaboratoryHeaderComponent {
  lab = input.required<Laboratory>();
}
