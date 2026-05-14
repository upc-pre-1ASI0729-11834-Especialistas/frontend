import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-laboratories-pagination',
  imports: [MatButton],
  templateUrl: './laboratories-pagination.component.html',
  styleUrl: './laboratories-pagination.component.css'
})
export class LaboratoriesPaginationComponent {
  totalPages = input.required<number>();
  currentPage = input.required<number>();
  showingFrom = input.required<number>();
  showingTo = input.required<number>();
  totalCount = input.required<number>();
  pages = input.required<(number | '...')[]>();

  pageClick = output<number | '...'>();
  prevPage = output<void>();
  nextPage = output<void>();
}
