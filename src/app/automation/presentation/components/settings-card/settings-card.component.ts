import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-settings-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './settings-card.component.html',
  styleUrls: ['./settings-card.component.css']
})
export class SettingsCardComponent {
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  buttonLabel = input.required<string>();
  buttonStyle = input<'filled' | 'outlined'>('outlined');

  actionClick = output<void>();

  onAction(): void {
    this.actionClick.emit();
  }
}
