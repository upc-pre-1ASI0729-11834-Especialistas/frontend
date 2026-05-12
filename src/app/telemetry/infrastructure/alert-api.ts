import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alert } from '../domain/model/alert.entity';
import { AlertApiEndpoint } from './alert-api-endpoint';

@Injectable({providedIn: 'root'})
export class AlertApi extends BaseApi {
  private readonly alertEndpoint: AlertApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.alertEndpoint = new AlertApiEndpoint(http);
  }

  getAlerts(): Observable<Alert[]> {
    return this.alertEndpoint.getAll();
  }

  getAlert(id: number): Observable<Alert> {
    return this.alertEndpoint.getById(id);
  }

  createAlert(alert: Alert): Observable<Alert> {
    return this.alertEndpoint.create(alert);
  }

  updateAlert(alert: Alert): Observable<Alert> {
    return this.alertEndpoint.update(alert, alert.id);
  }

  deleteAlert(id: number): Observable<void> {
    return this.alertEndpoint.delete(id);
  }
}
