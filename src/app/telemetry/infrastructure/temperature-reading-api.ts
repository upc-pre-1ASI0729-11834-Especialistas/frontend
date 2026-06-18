import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TemperatureReading } from '../domain/model/temperature-reading.entity';
import { TemperatureReadingApiEndpoint } from './temperature-reading-api-endpoint';
import { TemperatureReadingAssembler } from './temperature-reading.assembler';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class TemperatureReadingApi extends BaseApi {
  private readonly temperatureReadingEndpoint: TemperatureReadingApiEndpoint;

  constructor(private readonly http: HttpClient) {
    super();
    this.temperatureReadingEndpoint = new TemperatureReadingApiEndpoint(http);
  }

  getReadings(): Observable<TemperatureReading[]> {
    return this.temperatureReadingEndpoint.getAll();
  }

  getReadingsByMetric(metricKey: string): Observable<TemperatureReading[]> {
    const url = `${environment.platformProviderApiBaseUrl}/api/v1/telemetry/readings?metricKey=${metricKey}`;
    return this.http.get<any[]>(url).pipe(
      map(response => {
        const assembler = new TemperatureReadingAssembler();
        const data = Array.isArray(response) ? response : [];
        return data.map(resource => assembler.toEntityFromResource(resource));
      })
    );
  }

  getReading(id: number): Observable<TemperatureReading> {
    return this.temperatureReadingEndpoint.getById(id);
  }
}
