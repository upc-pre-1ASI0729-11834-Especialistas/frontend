import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { MetricType } from '../domain/model/metric-type.entity';
import { MetricTypeResource, MetricTypeResponse } from './metric-type-response';

export class MetricTypeAssembler implements BaseAssembler<MetricType, MetricTypeResource, MetricTypeResponse> {
  toEntityFromResource(resource: MetricTypeResource): MetricType {
    return new MetricType({
      id: resource.id,
      key: resource.key,
      displayName: resource.displayName,
      unit: resource.unit,
      icon: resource.icon,
      category: resource.category,
      active: resource.active
    });
  }

  toResourceFromEntity(entity: MetricType): MetricTypeResource {
    return {
      id: entity.id,
      key: entity.key,
      displayName: entity.displayName,
      unit: entity.unit,
      icon: entity.icon,
      category: entity.category,
      active: entity.active
    } as MetricTypeResource;
  }

  toEntitiesFromResponse(response: MetricTypeResponse): MetricType[] {
    const data = Array.isArray(response) ? response : (response.data || []);
    return data.map(resource => this.toEntityFromResource(resource));
  }
}
