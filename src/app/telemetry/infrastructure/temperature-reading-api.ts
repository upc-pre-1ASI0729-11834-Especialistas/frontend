import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TemperatureReading } from '../domain/model/temperature-reading.entity';
import { TemperatureReadingApiEndpoint } from './temperature-reading-api-endpoint';

@Injectable({providedIn: 'root'})
export class TemperatureReadingApi extends BaseApi {
  private readonly temperatureReadingEndpoint: TemperatureReadingApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.temperatureReadingEndpoint = new TemperatureReadingApiEndpoint(http);
  }

  getReadings(): Observable<TemperatureReading[]> {
    return this.temperatureReadingEndpoint.getAll();
  }

  getReading(id: number): Observable<TemperatureReading> {
    return this.temperatureReadingEndpoint.getById(id);
  }
}
