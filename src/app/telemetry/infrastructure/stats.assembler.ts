import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DashboardStats } from '../domain/model/dashboard-stats.entity';
import { DashboardStatsResource, DashboardStatsResponse } from './stats-response';

export class StatsAssembler implements BaseAssembler<DashboardStats, DashboardStatsResource, DashboardStatsResponse> {
  toEntityFromResource(resource: DashboardStatsResource): DashboardStats {
    return new DashboardStats({
      id: resource.id,
      totalLaboratories: resource.totalLaboratories,
      activeAlerts: resource.activeAlerts,
      systemsHealth: resource.systemsHealth,
      upcomingMaintenance: resource.upcomingMaintenance
    });
  }

  toResourceFromEntity(entity: DashboardStats): DashboardStatsResource {
    return {
      id: entity.id,
      totalLaboratories: entity.totalLaboratories,
      activeAlerts: entity.activeAlerts,
      systemsHealth: entity.systemsHealth,
      upcomingMaintenance: entity.upcomingMaintenance
    };
  }

  toEntitiesFromResponse(response: DashboardStatsResponse): DashboardStats[] {
    return response.stats.map(resource => this.toEntityFromResource(resource));
  }
}
