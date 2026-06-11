import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-role-badge',
  standalone: true,
  imports: [],
  templateUrl: './role-badge.component.html',
  styleUrl: './role-badge.component.css'
})
export class RoleBadgeComponent {
  @Input() role: string = '';

  get badgeClass(): string {
    switch (this.role) {
      case 'Lab Coordinator': return 'badge-coordinator';
      case 'Supervisor': return 'badge-supervisor';
      case 'Lab Technician': return 'badge-technician';
      case 'Read Only': return 'badge-readonly';
      default: return 'badge-default';
    }
  }
}
