import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { SensorConfiguration } from '../domain/model/sensor-configuration.entity';
import { SensorConfigurationResource, SensorConfigurationsResponse } from './sensor-configuration-response';

export class SensorConfigurationAssembler implements BaseAssembler<SensorConfiguration, SensorConfigurationResource, SensorConfigurationsResponse> {
  toEntitiesFromResponse(response: SensorConfigurationsResponse): SensorConfiguration[] {
    return response.sensorConfigurations.map(resource => this.toEntityFromResource(resource as SensorConfigurationResource));
  }

  toEntityFromResource(resource: SensorConfigurationResource): SensorConfiguration {
    return new SensorConfiguration({
      id: resource.id,
      sensorName: resource.sensorName,
      type: resource.type,
      unit: resource.unit,
      calibrationDate: resource.calibrationDate,
      isActive: resource.isActive,
      status: resource.status,
      lastConnected: resource.lastConnected,
      laboratoryId: resource.laboratoryId,
      laboratoryName: resource.laboratoryName,
    });
  }

  toResourceFromEntity(entity: SensorConfiguration): SensorConfigurationResource {
    return {
      id: entity.id,
      sensorName: entity.sensorName,
      type: entity.type,
      unit: entity.unit,
      calibrationDate: entity.calibrationDate,
      isActive: entity.isActive,
      status: entity.status,
      lastConnected: entity.lastConnected,
      laboratoryId: entity.laboratoryId,
      laboratoryName: entity.laboratoryName,
    } as SensorConfigurationResource;
  }
}
