import { MatIcon } from '@angular/material/icon';
import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconBadgeComponent } from '../../../../../../shared/presentation/components/icon-badge/icon-badge.component';
import { CardComponent } from '../../../../../../shared/presentation/components/card/card.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { SectionHeaderComponent } from '../../../../../../shared/presentation/components/section-header/section-header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-lab-sensors-config',
  imports: [MatIcon, IconBadgeComponent, CardComponent, SectionHeaderComponent, MatSlideToggle, FormsModule, TranslateModule],
  templateUrl: './lab-sensors-config.component.html',
  styleUrl: './lab-sensors-config.component.css'
})
export class LabSensorsConfigComponent {
  metricSubscriptions = model.required<{
    metricTypeId: number;
    metricTypeKey: string;
    metricTypeDisplayName: string;
    metricTypeIcon: string;
    metricTypeUnit: string;
    minThreshold?: number;
    maxThreshold?: number;
    enabled: boolean;
  }[]>();

  toggleSubscription(metricTypeId: number): void {
    const list = this.metricSubscriptions();
    const updated = list.map(item => {
      if (item.metricTypeId === metricTypeId) {
        return { ...item, enabled: !item.enabled };
      }
      return item;
    });
    this.metricSubscriptions.set(updated);
  }

  onThresholdChange(metricTypeId: number, type: 'min' | 'max', value: any): void {
    const list = this.metricSubscriptions();
    const updated = list.map(item => {
      if (item.metricTypeId === metricTypeId) {
        const val = value === null || value === '' ? undefined : Number(value);
        if (type === 'min') {
          return { ...item, minThreshold: val };
        } else {
          return { ...item, maxThreshold: val };
        }
      }
      return item;
    });
    this.metricSubscriptions.set(updated);
  }
}
