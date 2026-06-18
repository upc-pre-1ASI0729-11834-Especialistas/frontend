import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AutomationStore } from '../../../application/automation.store';

@Component({
  selector: 'app-alerts-notifications-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './alerts-notifications-page.component.html',
  styleUrl: './alerts-notifications-page.component.css'
})
export class AlertsNotificationsPageComponent {
  protected readonly automationStore = inject(AutomationStore);
}
