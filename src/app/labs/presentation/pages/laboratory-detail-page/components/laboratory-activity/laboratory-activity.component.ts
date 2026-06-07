import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LabActivity } from '../../../../../domain/model/laboratory.entity';

@Component({
  selector: 'app-laboratory-activity',
  imports: [RouterLink],
  templateUrl: './laboratory-activity.component.html',
  styleUrl: './laboratory-activity.component.css',
})
export class LaboratoryActivityComponent {
  activities = input.required<LabActivity[]>();
}
