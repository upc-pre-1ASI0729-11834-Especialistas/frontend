import { Component, inject, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AutomationStore } from '../../../application/automation.store';
import { SensorListItemComponent } from '../../components/sensor-list-item/sensor-list-item.component';
import { CreateSensorDialog } from '../../components/create-sensor-dialog/create-sensor-dialog';
import { CalibrateSensorDialog } from '../../components/calibrate-sensor-dialog/calibrate-sensor-dialog';
import { SensorConfiguration } from '../../../domain/model/sensor-configuration.entity';
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
    MatDialogModule,
    SensorListItemComponent,
    RouterModule
  ],
  templateUrl: './sensor-configuration-page.component.html',
  styleUrl: './sensor-configuration-page.component.css'
})
export class SensorConfigurationPageComponent {
  protected readonly automationStore = inject(AutomationStore);
  private readonly dialog = inject(MatDialog);

  // Filters state
  readonly selectedType = signal<string>('all-types');
  readonly selectedLocation = signal<string>('all-locations');

  // Parse location helper
  getLocation(sensorName: string): string {
    const parts = sensorName.split(' - ');
    return parts.length > 1 ? parts[1] : 'Unknown';
  }

  // Dynamic filter options based on loaded sensors
  readonly sensorTypes = computed(() => {
    const types = this.automationStore.sensorConfigurations().map(s => s.type);
    return [...new Set(types)];
  });

  readonly sensorLocations = computed(() => {
    const locs = this.automationStore.sensorConfigurations().map(s => this.getLocation(s.sensorName));
    return [...new Set(locs)].filter(l => l !== 'Unknown');
  });

  // Filtered sensor list
  readonly filteredSensors = computed(() => {
    let list = this.automationStore.sensorConfigurations();
    const type = this.selectedType();
    const location = this.selectedLocation();

    if (type && type !== 'all-types') {
      list = list.filter(s => s.type === type);
    }
    if (location && location !== 'all-locations') {
      list = list.filter(s => this.getLocation(s.sensorName) === location);
    }
    return list;
  });

  // Calibration Compliance dynamic metrics
  readonly totalActive = computed(() =>
    this.automationStore.sensorConfigurations().filter(s => s.isActive).length
  );

  readonly calibratedCount = computed(() => {
    return this.automationStore.sensorConfigurations().filter(s => {
      if (!s.isActive) return false;
      const calDate = new Date(s.calibrationDate);
      const today = new Date('2026-05-13');
      const diffTime = today.getTime() - calDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 365;
    }).length;
  });

  readonly pendingCount = computed(() => {
    return this.automationStore.sensorConfigurations().filter(s => {
      if (!s.isActive) return false;
      const calDate = new Date(s.calibrationDate);
      const today = new Date('2026-05-13');
      const diffTime = today.getTime() - calDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 300 && diffDays <= 365;
    }).length;
  });

  readonly overdueCount = computed(() => {
    return this.automationStore.sensorConfigurations().filter(s => {
      if (!s.isActive) return false;
      const calDate = new Date(s.calibrationDate);
      const today = new Date('2026-05-13');
      const diffTime = today.getTime() - calDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 365;
    }).length;
  });

  readonly calibratedPercent = computed(() => {
    const total = this.totalActive();
    return total > 0 ? Math.round((this.calibratedCount() / total) * 100) : 0;
  });

  readonly pendingPercent = computed(() => {
    const total = this.totalActive();
    return total > 0 ? Math.round((this.pendingCount() / total) * 100) : 0;
  });

  readonly overduePercent = computed(() => {
    const total = this.totalActive();
    return total > 0 ? Math.round((this.overdueCount() / total) * 100) : 0;
  });

  // Dialog actions
  openCreateSensorDialog(sensor?: SensorConfiguration): void {
    const dialogRef = this.dialog.open(CreateSensorDialog, {
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '400px',
      panelClass: 'side-sheet-dialog',
      data: { sensor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (sensor) {
          const updated = new SensorConfiguration({
            id: sensor.id,
            sensorName: result.sensorName,
            type: result.type,
            unit: result.unit,
            calibrationDate: sensor.calibrationDate,
            isActive: result.isActive,
            laboratoryId: result.laboratoryId
          });
          this.automationStore.updateSensorConfiguration(sensor.id, updated).subscribe();
        } else {
          const newSensor = new SensorConfiguration({
            id: 0,
            sensorName: result.sensorName,
            type: result.type,
            unit: result.unit,
            calibrationDate: '',
            isActive: result.isActive,
            laboratoryId: result.laboratoryId
          });
          this.automationStore.createSensorConfiguration(newSensor).subscribe();
        }
      }
    });
  }

  openCalibrateSensorDialog(sensor: SensorConfiguration): void {
    const dialogRef = this.dialog.open(CalibrateSensorDialog, {
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '400px',
      panelClass: 'side-sheet-dialog',
      data: { sensor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.automationStore.calibrateSensor(
          sensor.id,
          result.certificateId,
          new Date(result.expirationDate),
          new Date(result.calibratedAt)
        ).subscribe();
      }
    });
  }

  // Audit Report CSV download
  downloadAuditReport(): void {
    const headers = ['ID', 'Sensor Name', 'Type/Model', 'Serial Number/Unit', 'Last Calibration', 'Status'];
    const rows = this.automationStore.sensorConfigurations().map(s => [
      s.id,
      s.sensorName,
      s.type,
      s.unit,
      s.calibrationDate || 'N/A',
      s.isActive ? 'Active' : 'Inactive'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sensor_audit_report_${new Date().toISOString().substring(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
