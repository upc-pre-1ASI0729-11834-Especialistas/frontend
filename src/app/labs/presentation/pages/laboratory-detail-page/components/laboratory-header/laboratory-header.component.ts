import { MatIcon } from '@angular/material/icon';
import { Component, input } from '@angular/core';
import { Laboratory } from '../../../../../domain/model/laboratory.entity';
import { StatusBadgeComponent } from '../../../../../../shared/presentation/components/status-badge/status-badge.component';

@Component({
  selector: 'app-laboratory-header',
  imports: [MatIcon, StatusBadgeComponent],
  templateUrl: './laboratory-header.component.html',
  styleUrl: './laboratory-header.component.css',
})
export class LaboratoryHeaderComponent {
  lab = input.required<Laboratory>();
}
