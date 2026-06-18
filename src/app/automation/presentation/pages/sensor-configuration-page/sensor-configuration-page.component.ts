import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomationStore } from '../../../application/automation.store';
import { SensorListItemComponent } from '../../components/sensor-list-item/sensor-list-item.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sensor-configuration-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    SensorListItemComponent,
    RouterModule
  ],
  templateUrl: './sensor-configuration-page.component.html',
  styleUrl: './sensor-configuration-page.component.css'
})
export class SensorConfigurationPageComponent {
  protected readonly automationStore = inject(AutomationStore);
}
