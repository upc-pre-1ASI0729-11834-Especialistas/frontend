import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { TemperatureReading } from '../domain/model/temperature-reading.entity';
import { TemperatureReadingResource, TemperatureReadingResponse } from './temperature-reading-response';

export class TemperatureReadingAssembler implements BaseAssembler<TemperatureReading, TemperatureReadingResource, TemperatureReadingResponse> {
  toEntityFromResource(resource: TemperatureReadingResource): TemperatureReading {
    return new TemperatureReading({
      id: resource.id,
      date: resource.date,
      lab01Value: resource.lab01Value,
      lab02Value: resource.lab02Value
    });
  }

  toResourceFromEntity(entity: TemperatureReading): TemperatureReadingResource {
    return {
      id: entity.id,
      date: entity.date,
      lab01Value: entity.lab01Value,
      lab02Value: entity.lab02Value
    };
  }

  toEntitiesFromResponse(response: TemperatureReadingResponse): TemperatureReading[] {
    return response.readings.map(resource => this.toEntityFromResource(resource));
  }
}
