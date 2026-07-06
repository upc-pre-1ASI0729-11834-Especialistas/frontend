import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon-badge',
  templateUrl: './icon-badge.component.html',
  styleUrls: ['./icon-badge.component.css'],
})
export class IconBadgeComponent {
  color = input<string>('var(--mat-sys-primary)');

  size = input<'sm' | 'md' | 'lg'>('sm');

  background = input<string>();
}
