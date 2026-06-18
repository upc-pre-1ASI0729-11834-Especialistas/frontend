import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Laboratory, LaboratoryType, GasSensitivity, AlertEscalation } from '../domain/model/laboratory.entity';
import { LaboratoryResource, LaboratoryResponse } from './laboratory-response';

export class LaboratoryAssembler implements BaseAssembler<Laboratory, LaboratoryResource, LaboratoryResponse> {
  
  toEntityFromResource(resource: LaboratoryResource): Laboratory {
    return new Laboratory({
      id: resource.id,
      name: resource.name,
      type: resource.type as LaboratoryType,
      status: resource.status,
      building: resource.building,
      floor: resource.floor,
      labCode: resource.labCode,
      overallStatus: resource.overallStatus,
      active: resource.active,
      lastUpdate: resource.lastUpdate,
      isLive: resource.isLive,
      nextMaintenance: resource.nextMaintenance,
      maintenanceDaysLeft: resource.maintenanceDaysLeft,
      metrics: resource.metrics.map(m => ({ ...m })),
      recentAlerts: resource.recentAlerts.map(a => ({ ...a })),
      recentActivities: resource.recentActivities.map(act => ({ ...act })),
      schedules: resource.schedules.map(s => ({ ...s })),
      roomNumber: resource.roomNumber,
      description: resource.description,
      sensors: resource.sensors ? { ...resource.sensors } : undefined,
      thresholds: resource.thresholds ? {
        ...resource.thresholds,
        gasSensitivity: resource.thresholds.gasSensitivity as GasSensitivity,
        alertEscalation: resource.thresholds.alertEscalation as AlertEscalation
      } : undefined,
      notifications: resource.notifications ? { ...resource.notifications } : undefined
    });
  }

  toResourceFromEntity(entity: Laboratory): LaboratoryResource {
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      status: entity.status,
      building: entity.building,
      floor: entity.floor,
      labCode: entity.labCode,
      overallStatus: entity.overallStatus,
      active: entity.active,
      lastUpdate: entity.lastUpdate,
      isLive: entity.isLive,
      nextMaintenance: entity.nextMaintenance,
      maintenanceDaysLeft: entity.maintenanceDaysLeft,
      metrics: entity.metrics.map(m => ({ ...m })),
      recentAlerts: entity.recentAlerts.map(a => ({ ...a })),
      recentActivities: entity.recentActivities.map(act => ({ ...act })),
      schedules: entity.schedules.map(s => ({ ...s })),
      roomNumber: entity.roomNumber,
      description: entity.description,
      sensors: entity.sensors ? { ...entity.sensors } : undefined,
      thresholds: entity.thresholds ? {
        ...entity.thresholds,
        gasSensitivity: entity.thresholds.gasSensitivity as string,
        alertEscalation: entity.thresholds.alertEscalation as string
      } : undefined,
      notifications: entity.notifications ? { ...entity.notifications } : undefined
    };
  }

  toEntitiesFromResponse(response: LaboratoryResponse): Laboratory[] {
    return response.data.map(resource => this.toEntityFromResource(resource));
  }
}
