import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats } from '../domain/model/dashboard-stats.entity';
import { StatsApiEndpoint } from './stats-api-endpoint';

@Injectable({providedIn: 'root'})
export class StatsApi extends BaseApi {
  private readonly statsEndpoint: StatsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.statsEndpoint = new StatsApiEndpoint(http);
  }

  getStats(): Observable<DashboardStats[]> {
    return this.statsEndpoint.getAll();
  }

  getStat(id: number): Observable<DashboardStats> {
    return this.statsEndpoint.getById(id);
  }

  updateStats(stats: DashboardStats): Observable<DashboardStats> {
    return this.statsEndpoint.update(stats, stats.id);
  }
}
