import { Component, input, output, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SensorConfiguration } from '../../../domain/model/sensor-configuration.entity';

@Component({
  selector: 'app-sensor-list-item',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './sensor-list-item.component.html',
  styleUrl: './sensor-list-item.component.css'
})
export class SensorListItemComponent {
  sensor = input.required<SensorConfiguration>();

  calibrate = output<SensorConfiguration>();
  edit = output<SensorConfiguration>();

  // Determine icon based on type
  icon = computed(() => {
    const type = this.sensor().type.toLowerCase();
    if (type.includes('temp')) return 'device_thermostat';
    if (type.includes('pressure')) return 'warning'; // Placeholder for pressure
    if (type.includes('humid')) return 'water_drop';
    if (type.includes('co2')) return 'co2';
    return 'sensors';
  });

  // Calculate status
  status = computed(() => {
    if (!this.sensor().isActive) return 'Inactive';

    // Simple logic for "Needs Calibration" based on date (mock)
    const calDate = new Date(this.sensor().calibrationDate);
    const today = new Date('2026-05-13'); // Fixed current date context
    const diffTime = today.getTime() - calDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 365) return 'Needs Calibration';
    return 'Active';
  });

  connectionStatus = computed(() => {
    const s = this.sensor().status;
    if (!s) return 'INACTIVE';
    return s.toUpperCase();
  });

  lastConnectedText = computed(() => {
    const date = this.sensor().lastConnected;
    if (!date) return 'Never';
    try {
      return new Date(date).toLocaleString();
    } catch (e) {
      return String(date);
    }
  });

  onCalibrate(): void {
    this.calibrate.emit(this.sensor());
  }

  onEdit(): void {
    this.edit.emit(this.sensor());
  }
}
