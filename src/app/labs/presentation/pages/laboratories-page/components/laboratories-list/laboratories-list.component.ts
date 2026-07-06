import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LaboratoryDetailCardComponent } from '../laboratory-detail-card/laboratory-detail-card.component';
import { Laboratory } from '../../../../../domain/model/laboratory.entity';

@Component({
  selector: 'app-laboratories-list',
  imports: [RouterLink, LaboratoryDetailCardComponent],
  templateUrl: './laboratories-list.component.html',
  styleUrls: ['']
})
export class LaboratoriesListComponent {
  laboratories = input.required<Laboratory[]>();
  viewMode = input.required<'grid' | 'list'>();
}
