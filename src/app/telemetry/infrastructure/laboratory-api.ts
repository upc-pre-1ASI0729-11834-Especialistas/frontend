import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Laboratory } from '../domain/model/laboratory.entity';
import { LaboratoryApiEndpoint } from './laboratory-api-endpoint';

@Injectable({providedIn: 'root'})
export class LaboratoryApi extends BaseApi {
  private readonly laboratoryEndpoint: LaboratoryApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.laboratoryEndpoint = new LaboratoryApiEndpoint(http);
  }

  getLaboratories(): Observable<Laboratory[]> {
    return this.laboratoryEndpoint.getAll();
  }

  getLaboratory(id: number): Observable<Laboratory> {
    return this.laboratoryEndpoint.getById(id);
  }

  createLaboratory(laboratory: Laboratory): Observable<Laboratory> {
    return this.laboratoryEndpoint.create(laboratory);
  }

  updateLaboratory(laboratory: Laboratory): Observable<Laboratory> {
    return this.laboratoryEndpoint.update(laboratory, laboratory.id);
  }

  deleteLaboratory(id: number): Observable<void> {
    return this.laboratoryEndpoint.delete(id);
  }
}
