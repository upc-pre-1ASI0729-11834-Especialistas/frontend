import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.delevopment';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Laboratory } from '../domain/model/laboratory.entity';
import { LaboratoryApiEndpoint } from './laboratory-api-endpoint';
import { Observable } from 'rxjs';
import { LaboratoryResponse } from './laboratory-response';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryApi extends BaseApi {
  private readonly endpoint: LaboratoryApiEndpoint;

  constructor(private http: HttpClient) {
    super();
    const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderLabsEndpointPath}`;
    this.endpoint = new LaboratoryApiEndpoint(this.http, endpointUrl);
  }

  getAll(): Observable<Laboratory[]> {
    return this.endpoint.getAll();
  }

  getById(id: number): Observable<Laboratory> {
    return this.endpoint.getById(id);
  }

  create(laboratory: Laboratory): Observable<Laboratory> {
    return this.endpoint.create(laboratory);
  }

  update(laboratory: Laboratory, id: number): Observable<Laboratory> {
    return this.endpoint.update(laboratory, id);
  }

  delete(id: number): Observable<void> {
    return this.endpoint.delete(id);
  }
}
