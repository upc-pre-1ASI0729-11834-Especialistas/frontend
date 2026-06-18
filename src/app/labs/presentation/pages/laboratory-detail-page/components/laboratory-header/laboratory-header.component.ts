import { MatIcon } from '@angular/material/icon';
import { Component, input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Laboratory } from '../../../../../domain/model/laboratory.entity';
import { StatusBadgeComponent } from '../../../../../../shared/presentation/components/status-badge/status-badge.component';

@Component({
  selector: 'app-laboratory-header',
  imports: [MatIcon, StatusBadgeComponent, RouterLink],
  templateUrl: './laboratory-header.component.html',
  styleUrl: './laboratory-header.component.css',
})
export class LaboratoryHeaderComponent {
  lab = input.required<Laboratory>();
  @Output() addObservation = new EventEmitter<void>();
}
