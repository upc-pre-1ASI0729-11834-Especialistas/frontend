import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class SensorConfiguration implements BaseEntity {
  private _id: number;
  private _sensorName: string;
  private _type: string;
  private _unit: string;
  private _calibrationDate: string;
  private _isActive: boolean;
  private _status: string;
  private _lastConnected: string;
  private _laboratoryId?: number;
  private _laboratoryName?: string;
  private _equipmentId?: number;
  private _equipmentName?: string;
  private _minThreshold?: number;
  private _maxThreshold?: number;
  private _warningThreshold?: number;

  constructor(data: {
    id: number;
    sensorName: string;
    type: string;
    unit: string;
    calibrationDate: string;
    isActive: boolean;
    status?: string;
    lastConnected?: string;
    laboratoryId?: number;
    laboratoryName?: string;
    equipmentId?: number;
    equipmentName?: string;
    minThreshold?: number;
    maxThreshold?: number;
    warningThreshold?: number;
  }) {
    this._id = data.id;
    this._sensorName = data.sensorName;
    this._type = data.type;
    this._unit = data.unit;
    this._calibrationDate = data.calibrationDate;
    this._isActive = data.isActive;
    this._status = data.status || 'INACTIVE';
    this._lastConnected = data.lastConnected || '';
    this._laboratoryId = data.laboratoryId;
    this._laboratoryName = data.laboratoryName;
    this._equipmentId = data.equipmentId;
    this._equipmentName = data.equipmentName;
    this._minThreshold = data.minThreshold;
    this._maxThreshold = data.maxThreshold;
    this._warningThreshold = data.warningThreshold;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get sensorName(): string { return this._sensorName; }
  set sensorName(value: string) { this._sensorName = value; }

  get type(): string { return this._type; }
  set type(value: string) { this._type = value; }

  get unit(): string { return this._unit; }
  set unit(value: string) { this._unit = value; }

  get calibrationDate(): string { return this._calibrationDate; }
  set calibrationDate(value: string) { this._calibrationDate = value; }

  get isActive(): boolean { return this._isActive; }
  set isActive(value: boolean) { this._isActive = value; }

  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }

  get lastConnected(): string { return this._lastConnected; }
  set lastConnected(value: string) { this._lastConnected = value; }

  get laboratoryId(): number | undefined { return this._laboratoryId; }
  set laboratoryId(value: number | undefined) { this._laboratoryId = value; }

  get laboratoryName(): string | undefined { return this._laboratoryName; }
  set laboratoryName(value: string | undefined) { this._laboratoryName = value; }

  get equipmentId(): number | undefined { return this._equipmentId; }
  set equipmentId(value: number | undefined) { this._equipmentId = value; }

  get equipmentName(): string | undefined { return this._equipmentName; }
  set equipmentName(value: string | undefined) { this._equipmentName = value; }

  get minThreshold(): number | undefined { return this._minThreshold; }
  set minThreshold(value: number | undefined) { this._minThreshold = value; }

  get maxThreshold(): number | undefined { return this._maxThreshold; }
  set maxThreshold(value: number | undefined) { this._maxThreshold = value; }

  get warningThreshold(): number | undefined { return this._warningThreshold; }
  set warningThreshold(value: number | undefined) { this._warningThreshold = value; }
}
