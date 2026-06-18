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
      metricSubscriptions: resource.metricSubscriptions
        ? resource.metricSubscriptions.map(sub => ({
            metricTypeId: sub.metricTypeId,
            metricTypeKey: sub.metricTypeKey,
            metricTypeDisplayName: sub.metricTypeDisplayName,
            metricTypeIcon: sub.metricTypeIcon,
            metricTypeUnit: sub.metricTypeUnit,
            metricTypeCategory: sub.metricTypeCategory,
            minThreshold: sub.minThreshold !== null ? sub.minThreshold : undefined,
            maxThreshold: sub.maxThreshold !== null ? sub.maxThreshold : undefined,
            active: sub.active
          }))
        : [],
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
      metricSubscriptions: entity.metricSubscriptions.map(sub => ({
        metricTypeId: sub.metricTypeId,
        metricTypeKey: sub.metricTypeKey,
        metricTypeDisplayName: sub.metricTypeDisplayName,
        metricTypeIcon: sub.metricTypeIcon,
        metricTypeUnit: sub.metricTypeUnit,
        metricTypeCategory: sub.metricTypeCategory,
        minThreshold: sub.minThreshold !== undefined ? sub.minThreshold : null,
        maxThreshold: sub.maxThreshold !== undefined ? sub.maxThreshold : null,
        active: sub.active
      })),
      notifications: entity.notifications ? { ...entity.notifications } : undefined
    };
  }

  toEntitiesFromResponse(response: LaboratoryResponse): Laboratory[] {
    return response.data.map(resource => this.toEntityFromResource(resource));
  }
}
