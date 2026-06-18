import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { SensorConfiguration } from '../domain/model/sensor-configuration.entity';
import { SensorConfigurationsApiEndpoint } from './sensor-configuration-api-endpoint';

@Injectable({ providedIn: 'root' })
export class SensorConfigurationsApi extends BaseApi {
  private readonly sensorConfigurationsEndpoint: SensorConfigurationsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.sensorConfigurationsEndpoint = new SensorConfigurationsApiEndpoint(http);
  }

  getSensorConfigurations(): Observable<SensorConfiguration[]> {
    return this.sensorConfigurationsEndpoint.getAll();
  }

  createSensorConfiguration(sensor: SensorConfiguration): Observable<SensorConfiguration> {
    return this.sensorConfigurationsEndpoint.create(sensor);
  }

  updateSensorConfiguration(id: number, sensor: SensorConfiguration): Observable<SensorConfiguration> {
    return this.sensorConfigurationsEndpoint.update(sensor, id);
  }

  calibrateSensor(id: number, certificateId: string, expirationDate: Date, calibratedAt: Date): Observable<SensorConfiguration> {
    return this.sensorConfigurationsEndpoint.calibrate(id, certificateId, expirationDate, calibratedAt);
  }
}
