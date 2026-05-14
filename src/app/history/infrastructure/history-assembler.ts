import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { HistoryRecord } from '../domain/model/history-record.entity';
import { HistoryRecordResource, HistoryResponse } from './history-response';

export class HistoryAssembler implements BaseAssembler<HistoryRecord, HistoryRecordResource, HistoryResponse> {
  toEntitiesFromResponse(response: HistoryResponse): HistoryRecord[] {
    return response.history.map(resource => this.toEntityFromResource(resource as HistoryRecordResource));
  }

  toEntityFromResource(resource: HistoryRecordResource): HistoryRecord {
    return new HistoryRecord({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      occurredAt: resource.occurredAt,
      lab: resource.lab,
      eventType: resource.eventType,
      severity: resource.severity,
      status: resource.status
    });
  }

  toResourceFromEntity(entity: HistoryRecord): HistoryRecordResource {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      occurredAt: entity.occurredAt,
      lab: entity.lab,
      eventType: entity.eventType,
      severity: entity.severity,
      status: entity.status
    } as HistoryRecordResource;
  }
}

