import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TemperatureChartComponent } from '../../components/temperature-chart/temperature-chart.component';
import { LaboratoryCardComponent } from '../../components/laboratory-card/laboratory-card.component';
import { DashboardStore } from '../../../application/dashboard.store';
import { StatCardComponent } from '../../../../shared/presentation/components/stat-card/stat-card.component';
import { TranslateModule } from '@ngx-translate/core';

import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    RouterLink,
    StatCardComponent,
    TemperatureChartComponent,
    LaboratoryCardComponent,
    MatIcon,
    TranslateModule
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent implements OnInit {
  protected readonly dashboardStore = inject(DashboardStore);

  ngOnInit(): void {
    this.dashboardStore.loadAll();
  }

  onPeriodChange(period: string): void {
    this.dashboardStore.loadTemperatureTrends(period);
  }

  onSearch(term: string): void {
    console.log('Searching for:', term);
  }
}
