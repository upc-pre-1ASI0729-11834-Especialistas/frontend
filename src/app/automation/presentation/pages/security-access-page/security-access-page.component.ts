import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutomationStore } from '../../../application/automation.store';

@Component({
  selector: 'app-security-access-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './security-access-page.component.html',
  styleUrl: './security-access-page.component.css'
})
export class SecurityAccessPageComponent {
  protected readonly automationStore = inject(AutomationStore);
}
