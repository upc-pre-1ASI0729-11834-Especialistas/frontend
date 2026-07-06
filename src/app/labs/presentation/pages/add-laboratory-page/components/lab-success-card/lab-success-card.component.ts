import { MatIcon } from '@angular/material/icon';
import { Component, input, output } from '@angular/core';
import { Laboratory } from '../../../../../domain/model/laboratory.entity';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-lab-success-card',
  imports: [MatIcon, TranslatePipe],
  templateUrl: './lab-success-card.component.html',
  styleUrls: ['./lab-success-card.component.css']
})
export class LabSuccessCardComponent {
  createdLab = input.required<Laboratory | null>();
  goToLaboratories = output<void>();
  createAnother = output<void>();
}
