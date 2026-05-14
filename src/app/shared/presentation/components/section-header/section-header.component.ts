import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-section-header',
  imports: [MatIcon],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.css',
})
export class SectionHeaderComponent {
  icon = input.required<string>();
  iconColor = input<string>('var(--mat-sys-on-surface-variant)');
  title = input.required<string>();
  subtitle = input<string>('');
}
