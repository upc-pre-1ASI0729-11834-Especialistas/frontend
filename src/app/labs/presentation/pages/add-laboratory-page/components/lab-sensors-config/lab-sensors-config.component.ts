import { MatIcon } from '@angular/material/icon';
import { Component, model, input } from '@angular/core';
import { SensorConfig } from '../../../../../domain/model/laboratory.entity';
import { IconBadgeComponent } from '../../../../../../shared/presentation/components/icon-badge/icon-badge.component';
import { CardComponent } from '../../../../../../shared/presentation/components/card/card.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { SectionHeaderComponent } from '../../../../../../shared/presentation/components/section-header/section-header.component';

@Component({
  selector: 'app-lab-sensors-config',
  imports: [MatIcon, IconBadgeComponent, CardComponent, SectionHeaderComponent, MatSlideToggle],
  templateUrl: './lab-sensors-config.component.html',
  styleUrl: './lab-sensors-config.component.css'
})
export class LabSensorsConfigComponent {
  sensors = model.required<SensorConfig>();

  sensorCards = input.required<{
    key: keyof SensorConfig;
    label: string;
    description: string;
    icon: string;
    color: string;
  }[]>();

  toggleSensor(key: keyof SensorConfig): void {
    const current = this.sensors();
    this.sensors.set({
      ...current,
      [key]: !current[key]
    });
  }
}
