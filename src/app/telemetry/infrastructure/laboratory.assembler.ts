import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Laboratory } from '../domain/model/laboratory.entity';
import { LaboratoryResource, LaboratoryResponse } from './laboratory-response';

export class LaboratoryAssembler implements BaseAssembler<Laboratory, LaboratoryResource, LaboratoryResponse> {
  toEntityFromResource(resource: LaboratoryResource): Laboratory {
    return new Laboratory({
      id: resource.id,
      name: resource.name,
      type: resource.type,
      temperature: resource.temperature,
      status: resource.status
    });
  }

  toResourceFromEntity(entity: Laboratory): LaboratoryResource {
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      temperature: entity.temperature,
      status: entity.status
    };
  }

  toEntitiesFromResponse(response: LaboratoryResponse): Laboratory[] {
    return response.laboratories.map(resource => this.toEntityFromResource(resource));
  }
}
