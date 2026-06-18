import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { EquipmentThreshold } from '../domain/model/equipment-threshold.entity';
import { EquipmentThresholdResource, EquipmentThresholdsResponse } from './equipment-threshold-response';
import { EquipmentThresholdAssembler } from './equipment-threshold-assembler';

const equipmentThresholdsEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAutomationEquipmentThresholdsEndpointPath}`;

export class EquipmentThresholdsApiEndpoint extends BaseApiEndpoint<
  EquipmentThreshold,
  EquipmentThresholdResource,
  EquipmentThresholdsResponse,
  EquipmentThresholdAssembler
> {
  constructor(http: HttpClient) {
    super(http, equipmentThresholdsEndpointUrl, new EquipmentThresholdAssembler());
  }
}
