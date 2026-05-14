import { Component, input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { IconBadgeComponent } from '../icon-badge/icon-badge.component';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-stat-card',
  imports: [CardComponent, IconBadgeComponent, MatProgressBar],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
})
export class StatCardComponent {
  label = input.required<string>();
  value = input.required<string>();
  accentColor = input<string>('var(--mat-sys-primary)');
  showProgress = input<boolean>(false);
  progressValue = input<number>(0);
}
