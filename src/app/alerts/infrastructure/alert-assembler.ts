import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import { Alert } from '../domain/model/alert.entity';
import { Metric } from '../domain/model/metric.entity';
import { AlertResource, AlertsResponse } from './alerts-response';

export class AlertAssembler implements BaseAssembler<Alert, AlertResource, AlertsResponse> {
  toEntitiesFromResponse(response: AlertsResponse): Alert[] {
    return response.alerts.map(resource  => this.toEntityFromResource(resource as AlertResource));
  }

  toEntityFromResource(resource: AlertResource): Alert {
    const metricsMapped = resource.metrics 
      ? resource.metrics.map((m, index) => new Metric({ id: index, label: m.label, value: m.value }))
      : [];

    return new Alert({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      severity: resource.severity,
      status: resource.status,
      metrics: metricsMapped,
      createdAt: resource.createdAt ? new Date(resource.createdAt) : undefined,
      laboratoryId: resource.laboratoryId,
      labName: resource.labName,
      labLocation: resource.labLocation,
      sensorId: resource.sensorId,
      sensorName: resource.sensorName
    });
  }

  toResourceFromEntity(entity: Alert): AlertResource {
    const metricsMapped = entity.metrics
      ? entity.metrics.map(m => ({ label: m.label, value: m.value }))
      : [];

    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      severity: entity.severity,
      status: entity.status,
      createdAt: entity.createdAt ? entity.createdAt.toISOString() : undefined,
      laboratoryId: entity.laboratoryId,
      labName: entity.labName,
      labLocation: entity.labLocation,
      sensorId: entity.sensorId,
      sensorName: entity.sensorName,
      metrics: metricsMapped
    } as AlertResource;
  }
}
