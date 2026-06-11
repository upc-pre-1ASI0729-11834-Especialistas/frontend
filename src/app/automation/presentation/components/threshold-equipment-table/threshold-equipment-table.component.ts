import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EquipmentThreshold } from '../../../domain/model/equipment-threshold.entity';

@Component({
  selector: 'app-threshold-equipment-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './threshold-equipment-table.component.html',
  styleUrl: './threshold-equipment-table.component.css'
})
export class ThresholdEquipmentTableComponent {
  equipmentThresholds = input.required<EquipmentThreshold[]>();

  updateThreshold = output<{
    id: number;
    changes: {
      minThreshold?: number;
      maxThreshold?: number;
      warningAt?: number;
    };
  }>();

  onThresholdChange(item: EquipmentThreshold, field: 'minThreshold' | 'maxThreshold' | 'warningAt', event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const value = parseFloat(inputEl.value);
    if (!isNaN(value)) {
      this.updateThreshold.emit({
        id: item.id,
        changes: { [field]: value }
      });
    }
  }

  onEdit(item: EquipmentThreshold): void {
    this.updateThreshold.emit({
      id: item.id,
      changes: {
        minThreshold: item.minThreshold,
        maxThreshold: item.maxThreshold,
        warningAt: item.warningAt
      }
    });
  }
}
