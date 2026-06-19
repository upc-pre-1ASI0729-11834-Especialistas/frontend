import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { EquipmentThreshold } from '../domain/model/equipment-threshold.entity';
import { EquipmentThresholdsApiEndpoint } from './equipment-threshold-api-endpoint';

@Injectable({ providedIn: 'root' })
export class EquipmentThresholdsApi extends BaseApi {
  private readonly equipmentThresholdsEndpoint: EquipmentThresholdsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.equipmentThresholdsEndpoint = new EquipmentThresholdsApiEndpoint(http);
  }

  getEquipmentThresholds(): Observable<EquipmentThreshold[]> {
    return this.equipmentThresholdsEndpoint.getAll();
  }

  updateEquipmentThreshold(id: number, equipmentThreshold: EquipmentThreshold): Observable<EquipmentThreshold> {
    return this.equipmentThresholdsEndpoint.update(equipmentThreshold, id);
  }

  createEquipmentThreshold(equipmentThreshold: EquipmentThreshold): Observable<EquipmentThreshold> {
    return this.equipmentThresholdsEndpoint.create(equipmentThreshold);
  }
}
