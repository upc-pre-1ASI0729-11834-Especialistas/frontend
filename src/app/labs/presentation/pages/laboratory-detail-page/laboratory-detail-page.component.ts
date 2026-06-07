import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { LaboratoryStore } from '../../../application/laboratory.store';
import { MetricCardComponent } from './components/metric-card/metric-card.component';
import { LaboratoryHeaderComponent } from './components/laboratory-header/laboratory-header.component';
import { LaboratoryStatsComponent } from './components/laboratory-stats/laboratory-stats.component';
import { LaboratoryActivityComponent } from './components/laboratory-activity/laboratory-activity.component';
import { LaboratorySchedulesComponent } from './components/laboratory-schedules/laboratory-schedules.component';
import { StatusBadgeComponent } from '../../../../shared/presentation/components/status-badge/status-badge.component';

@Component({
  selector: 'app-laboratory-detail-page',
  imports: [
    RouterLink,
    FormsModule,
    MatIcon,
    MatProgressSpinner,
    MatTabGroup,
    MatTab,
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
  private readonly route = inject(ActivatedRoute);

  tabs = ['Systems', 'Notifications', 'Reports', 'Settings'];
  observationText = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.laboratoryStore.loadLaboratoryById(parseInt(id, 10));
    }
  }

  onTabChange(index: number): void {
    this.laboratoryStore.setActiveTab(this.tabs[index].toLowerCase());
  }

  saveObservation(): void {
    if (!this.observationText.trim()) return;
    console.log('Observation saved:', this.observationText);
    this.observationText = '';
  }
}
