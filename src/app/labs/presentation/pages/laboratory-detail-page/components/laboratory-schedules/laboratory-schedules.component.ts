import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LabSchedule } from '../../../../../domain/model/laboratory.entity';

@Component({
  selector: 'app-laboratory-schedules',
  imports: [RouterLink],
  templateUrl: './laboratory-schedules.component.html',
  styleUrl: './laboratory-schedules.component.css',
})
export class LaboratorySchedulesComponent {
  schedules = input.required<LabSchedule[]>();
}
