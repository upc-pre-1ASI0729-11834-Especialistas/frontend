import { Component, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LaboratoryStore } from '../../../application/laboratory.store';
import { HistoryStore } from '../../../../history/application/history.store';
import { AlertsStore } from '../../../../alerts/application/alerts.store';
import { HistoryRecord } from '../../../../history/domain/model/history-record.entity';
import { MetricCardComponent } from './components/metric-card/metric-card.component';
import { LaboratoryHeaderComponent } from './components/laboratory-header/laboratory-header.component';
import { LaboratoryStatsComponent } from './components/laboratory-stats/laboratory-stats.component';
import { LaboratoryActivityComponent } from './components/laboratory-activity/laboratory-activity.component';
import { LaboratorySchedulesComponent } from './components/laboratory-schedules/laboratory-schedules.component';
import { StatusBadgeComponent } from '../../../../shared/presentation/components/status-badge/status-badge.component';
import { AddObservationDialogComponent } from './components/add-observation-dialog/add-observation-dialog.component';

@Component({
  selector: 'app-laboratory-detail-page',
  imports: [
    RouterLink,
    FormsModule,
    MatIcon,
    MatProgressSpinner,
    MatTabGroup,
    MatTab,
    MatDialogModule,
    MetricCardComponent,
    LaboratoryHeaderComponent,
    LaboratoryStatsComponent,
    LaboratoryActivityComponent,
    LaboratorySchedulesComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './laboratory-detail-page.component.html',
  styleUrl: './laboratory-detail-page.component.css',
})
export class LaboratoryDetailPageComponent implements OnInit {
  protected readonly laboratoryStore = inject(LaboratoryStore);
  protected readonly alertsStore = inject(AlertsStore);
  private readonly historyStore = inject(HistoryStore);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  tabs = ['Systems', 'Notifications', 'Reports', 'Settings'];

  readonly activeAlert = computed(() => {
    const lab = this.laboratoryStore.selectedLaboratory();
    if (!lab) return undefined;
    const active = this.alertsStore.alerts().find(
      a => a.laboratoryId === lab.id && a.status !== 'RESOLVED'
    );
    if (active) {
      return {
        id: active.id,
        title: active.title,
        source: active.sensorName ? `Sensor ${active.sensorName}` : active.labLocation || 'N/A',
        timeAgo: 'Just now'
      };
    }
    return lab.recentAlerts[0] ? {
      id: Number(lab.recentAlerts[0].id),
      title: lab.recentAlerts[0].title,
      source: lab.recentAlerts[0].source,
      timeAgo: lab.recentAlerts[0].timeAgo
    } : undefined;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.laboratoryStore.loadLaboratoryById(parseInt(id, 10));
    }
  }

  onTabChange(index: number): void {
    this.laboratoryStore.setActiveTab(this.tabs[index].toLowerCase());
  }

  openAddObservationDialog(): void {
    const lab = this.laboratoryStore.selectedLaboratory();
    if (!lab) return;

    const dialogRef = this.dialog.open(AddObservationDialogComponent, {
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '400px',
      panelClass: 'side-sheet-dialog',
      data: { labName: lab.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.text) {
        const record = new HistoryRecord({
          id: 0,
          name: `${result.type} - ${lab.name}`,
          description: result.text,
          occurredAt: new Date().toISOString(),
          lab: lab.name,
          eventType: 'Observation',
          severity: result.type === 'Incident log' ? 'Critical' : 'Info',
          status: 'Active'
        });

        this.historyStore.addHistoryRecord(record, () => {
          this.laboratoryStore.loadLaboratoryById(lab.id);
        });
      }
    });
  }
}
