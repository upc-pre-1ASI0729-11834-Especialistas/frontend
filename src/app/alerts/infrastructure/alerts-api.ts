import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alert } from '../domain/model/alert.entity';
import { AlertsApiEndpoint } from './alerts-api-endpoint';

@Injectable({providedIn: 'root'})
export class AlertsApi extends BaseApi {
  private readonly alertsEndpoint: AlertsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.alertsEndpoint = new AlertsApiEndpoint(http);
  }

  getAlerts(): Observable<Alert[]> {
    return this.alertsEndpoint.getAll();
  }

  getAlert(id: number): Observable<Alert> {
    return this.alertsEndpoint.getById(id);
  }

  createAlert(alert: Alert): Observable<Alert> {
    return this.alertsEndpoint.create(alert);
  }

  updateAlert(alert: Alert): Observable<Alert> {
    return this.alertsEndpoint.update(alert, alert.id);
  }

  deleteAlert(id: number): Observable<void> {
    return this.alertsEndpoint.delete(id);
  }
}
