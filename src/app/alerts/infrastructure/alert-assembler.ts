import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import { Alert } from '../domain/model/alert.entity';
import { AlertResource, AlertsResponse } from './alerts-response';

export class AlertAssembler implements BaseAssembler<Alert, AlertResource, AlertsResponse> {
  toEntitiesFromResponse(response: AlertsResponse): Alert[] {
    return response.alerts.map(resource  => this.toEntityFromResource(resource as AlertResource));
  }

  toEntityFromResource(resource: AlertResource): Alert {
    return new Alert({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      severity: resource.severity,
      status: resource.status,
      metrics: []
    });
  }

  toResourceFromEntity(entity: Alert): AlertResource {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      severity: entity.severity,
      status: entity.status
    } as AlertResource;
  }

}
