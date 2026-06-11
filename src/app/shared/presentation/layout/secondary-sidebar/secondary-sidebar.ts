import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface SecondarySidebarItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-secondary-sidebar',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './secondary-sidebar.html',
  styleUrl: './secondary-sidebar.css'
})
export class SecondarySidebarComponent {
  @Input() title: string = '';
  @Input() items: SecondarySidebarItem[] = [];
}
