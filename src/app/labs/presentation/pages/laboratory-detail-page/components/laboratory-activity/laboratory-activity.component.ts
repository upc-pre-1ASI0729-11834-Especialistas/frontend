import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { LabActivity } from '../../../../../domain/model/laboratory.entity';

@Component({
  selector: 'app-laboratory-activity',
  imports: [RouterLink, MatIcon, TranslatePipe],
  templateUrl: './laboratory-activity.component.html',
  styleUrls: ['']
})
export class LaboratoryActivityComponent {
  activities = input.required<LabActivity[]>();
}
