import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Alert } from '../domain/model/alert.entity';
import { AlertResource, AlertResponse } from './alert-response';

export class AlertAssembler implements BaseAssembler<Alert, AlertResource, AlertResponse> {
  toEntityFromResource(resource: AlertResource): Alert {
    return new Alert({
      id: resource.id,
      labName: resource.labName,
      title: resource.title,
      description: resource.description,
      severity: resource.severity,
      timeAgo: resource.timeAgo
    });
  }

  toResourceFromEntity(entity: Alert): AlertResource {
    return {
      id: entity.id,
      labName: entity.labName,
      title: entity.title,
      description: entity.description,
      severity: entity.severity,
      timeAgo: entity.timeAgo
    };
  }

  toEntitiesFromResponse(response: AlertResponse): Alert[] {
    return response.alerts.map(resource => this.toEntityFromResource(resource));
  }
}
