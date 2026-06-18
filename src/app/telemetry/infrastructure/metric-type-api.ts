import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MetricType } from '../domain/model/metric-type.entity';
import { MetricTypeApiEndpoint } from './metric-type-api-endpoint';
import { MetricTypeAssembler } from './metric-type-assembler';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class MetricTypeApi extends BaseApi {
  private readonly metricTypeEndpoint: MetricTypeApiEndpoint;
  private readonly assembler = new MetricTypeAssembler();
  private readonly baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderTelemetryMetricTypesEndpointPath}`;

  constructor(private readonly http: HttpClient) {
    super();
    this.metricTypeEndpoint = new MetricTypeApiEndpoint(http);
  }

  getMetricTypes(): Observable<MetricType[]> {
    return this.metricTypeEndpoint.getAll();
  }

  getActiveMetricTypes(): Observable<MetricType[]> {
    return this.http.get<any[]>(`${this.baseUrl}/active`).pipe(
      map((response: any) => {
        const data = Array.isArray(response) ? response : (response && response.data ? response.data : []);
        return data.map((resource: any) => this.assembler.toEntityFromResource(resource));
      })
    );
  }

  createMetricType(metricType: MetricType): Observable<MetricType> {
    return this.metricTypeEndpoint.create(metricType);
  }

  updateMetricType(metricType: MetricType): Observable<MetricType> {
    return this.metricTypeEndpoint.update(metricType, metricType.id);
  }

  deleteMetricType(id: number): Observable<void> {
    return this.metricTypeEndpoint.delete(id);
  }
}
