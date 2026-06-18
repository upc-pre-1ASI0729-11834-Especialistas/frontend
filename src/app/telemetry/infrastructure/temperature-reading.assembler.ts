import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { TemperatureReading } from '../domain/model/temperature-reading.entity';
import { TemperatureReadingResource, TemperatureReadingResponse } from './temperature-reading-response';

export class TemperatureReadingAssembler implements BaseAssembler<TemperatureReading, TemperatureReadingResource, TemperatureReadingResponse> {
  toEntityFromResource(resource: TemperatureReadingResource): TemperatureReading {
    return new TemperatureReading({
      id: resource.id,
      date: resource.date,
      values: resource.values
    });
  }

  toResourceFromEntity(entity: TemperatureReading): TemperatureReadingResource {
    return {
      id: entity.id,
      date: entity.date,
      values: entity.values
    } as TemperatureReadingResource;
  }

  toEntitiesFromResponse(response: TemperatureReadingResponse): TemperatureReading[] {
    return response.readings.map(resource => this.toEntityFromResource(resource));
  }
}
