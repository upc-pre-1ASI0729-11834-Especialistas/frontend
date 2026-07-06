import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LaboratoriesToolbarComponent } from './components/laboratories-toolbar/laboratories-toolbar.component';
import { LaboratoriesListComponent } from './components/laboratories-list/laboratories-list.component';
import { LaboratoriesPaginationComponent } from './components/laboratories-pagination/laboratories-pagination.component';
import { LaboratoryStore } from '../../../application/laboratory.store';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CardComponent } from '../../../../shared/presentation/components/card/card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-laboratories-page',
  imports: [
    FormsModule,
    CardComponent,
    LaboratoriesToolbarComponent,
    LaboratoriesListComponent,
    LaboratoriesPaginationComponent,
    MatIcon,
    MatProgressSpinner,
    TranslateModule
  ],
  templateUrl: './laboratories-page.component.html',
  styleUrls: ['./laboratories-page.component.css'],
})
export class LaboratoriesPageComponent implements OnInit {
  protected readonly laboratoryStore = inject(LaboratoryStore);

  viewMode: 'grid' | 'list' = 'grid';

  ngOnInit(): void {

  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.laboratoryStore.setSearchQuery(value);
  }

  onStatusChange(value: string): void {
    this.laboratoryStore.setStatusFilter(value);
  }

  onLocationChange(value: string): void {
    this.laboratoryStore.setLocationFilter(value);
  }

  onPageClick(page: number | '...'): void {
    if (page === '...') return;
    this.laboratoryStore.goToPage(page);
  }
}
