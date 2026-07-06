import { Component, input } from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  imports: [MatCard],
})
export class CardComponent {
  borderColor = input<string>('');
  bgColor = input<string>('');
  padding = input<'default' | 'compact' | 'section' | 'none'>('default');
  appearance = input<'outlined' | 'raised'>('outlined');
  hoverLift = input<boolean>(false);
}
