import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface DashboardStatsResource extends BaseResource {
  id: number;
  totalLaboratories: number;
  activeAlerts: number;
  systemsHealth: number;
  upcomingMaintenance: number;
}

export interface DashboardStatsResponse extends BaseResponse {
  stats: DashboardStatsResource[];
}
