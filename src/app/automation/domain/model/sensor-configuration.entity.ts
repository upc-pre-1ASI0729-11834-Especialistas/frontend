import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class SensorConfiguration implements BaseEntity {
  private _id: number;
  private _sensorName: string;
  private _type: string;
  private _unit: string;
  private _calibrationDate: string;
  private _isActive: boolean;

  constructor(data: { id: number; sensorName: string; type: string; unit: string; calibrationDate: string; isActive: boolean }) {
    this._id = data.id;
    this._sensorName = data.sensorName;
    this._type = data.type;
    this._unit = data.unit;
    this._calibrationDate = data.calibrationDate;
    this._isActive = data.isActive;
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
}
