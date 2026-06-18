import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LaboratoryStore } from '../../../application/laboratory.store';
import { MetricCardComponent } from './components/metric-card/metric-card.component';
import { LaboratoryHeaderComponent } from './components/laboratory-header/laboratory-header.component';
import { LaboratoryStatsComponent } from './components/laboratory-stats/laboratory-stats.component';
import { LaboratoryAlertsComponent } from './components/laboratory-alerts/laboratory-alerts.component';
import { LaboratoryActivityComponent } from './components/laboratory-activity/laboratory-activity.component';
import { LaboratorySchedulesComponent } from './components/laboratory-schedules/laboratory-schedules.component';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-laboratory-detail-page',
  imports: [
    RouterLink,
    MetricCardComponent,
    LaboratoryHeaderComponent,
    LaboratoryStatsComponent,
    LaboratoryAlertsComponent,
    LaboratoryActivityComponent,
    LaboratorySchedulesComponent,
    MatIcon,
    MatProgressSpinner,
    MatTabGroup,
    MatTab,
  ],
  templateUrl: './laboratory-detail-page.component.html',
  styleUrl: './laboratory-detail-page.component.css',
})
export class LaboratoryDetailPageComponent implements OnInit {
  protected readonly laboratoryStore = inject(LaboratoryStore);
  private readonly route = inject(ActivatedRoute);

  tabs = ['Systems', 'Notifications', 'Reports', 'Settings'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.laboratoryStore.loadLaboratoryById(parseInt(id, 10));
    }
  }

  onTabClick(tab: string): void {
    this.laboratoryStore.setActiveTab(tab.toLowerCase());
  }

  onTabChange(index: number): void {
    this.laboratoryStore.setActiveTab(this.tabs[index].toLowerCase());
  }
}
