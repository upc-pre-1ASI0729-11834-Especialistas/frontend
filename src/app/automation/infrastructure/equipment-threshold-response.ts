import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface EquipmentThresholdResource extends BaseResource {
  id: number;
  name: string;
  icon: string;
  lab: string;
  minThreshold: number;
  maxThreshold: number;
  warningAt: number;
  unit: string;
  currentValue: number;
  status: string;
}

export interface EquipmentThresholdsResponse extends BaseResponse {
  equipmentThresholds: EquipmentThresholdResource[];
}
