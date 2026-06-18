import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { EquipmentThreshold } from '../domain/model/equipment-threshold.entity';
import { EquipmentThresholdResource, EquipmentThresholdsResponse } from './equipment-threshold-response';

export class EquipmentThresholdAssembler implements BaseAssembler<EquipmentThreshold, EquipmentThresholdResource, EquipmentThresholdsResponse> {
  toEntitiesFromResponse(response: EquipmentThresholdsResponse): EquipmentThreshold[] {
    // If the json server returns a flat array of resources, or if it has an object structure, handle it.
    // Usually json-server returns an array, but the response wrapper standard requires mapping.
    // Let's verify. If response itself is an array or has the key:
    const resources = response.equipmentThresholds || (response as any) || [];
    return resources.map((resource: any) => this.toEntityFromResource(resource as EquipmentThresholdResource));
  }

  toEntityFromResource(resource: EquipmentThresholdResource): EquipmentThreshold {
    return new EquipmentThreshold({
      id: resource.id,
      name: resource.name,
      icon: resource.icon,
      lab: resource.lab,
      minThreshold: resource.minThreshold,
      maxThreshold: resource.maxThreshold,
      warningAt: resource.warningAt,
      unit: resource.unit,
      currentValue: resource.currentValue,
      status: resource.status,
    });
  }

  toResourceFromEntity(entity: EquipmentThreshold): EquipmentThresholdResource {
    return {
      id: entity.id,
      name: entity.name,
      icon: entity.icon,
      lab: entity.lab,
      minThreshold: entity.minThreshold,
      maxThreshold: entity.maxThreshold,
      warningAt: entity.warningAt,
      unit: entity.unit,
      currentValue: entity.currentValue,
      status: entity.status,
    } as EquipmentThresholdResource;
  }
}
