import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class EquipmentThreshold implements BaseEntity {
  private _id: number;
  private _name: string;
  private _icon: string;
  private _lab: string;
  private _minThreshold: number;
  private _maxThreshold: number;
  private _warningAt: number;
  private _unit: string;
  private _currentValue: number;
  private _status: string;

  constructor(data: {
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
  }) {
    this._id = data.id;
    this._name = data.name;
    this._icon = data.icon;
    this._lab = data.lab;
    this._minThreshold = data.minThreshold;
    this._maxThreshold = data.maxThreshold;
    this._warningAt = data.warningAt;
    this._unit = data.unit;
    this._currentValue = data.currentValue;
    this._status = data.status;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get icon(): string { return this._icon; }
  set icon(value: string) { this._icon = value; }

  get lab(): string { return this._lab; }
  set lab(value: string) { this._lab = value; }

  get minThreshold(): number { return this._minThreshold; }
  set minThreshold(value: number) { this._minThreshold = value; }

  get maxThreshold(): number { return this._maxThreshold; }
  set maxThreshold(value: number) { this._maxThreshold = value; }

  get warningAt(): number { return this._warningAt; }
  set warningAt(value: number) { this._warningAt = value; }

  get unit(): string { return this._unit; }
  set unit(value: string) { this._unit = value; }

  get currentValue(): number { return this._currentValue; }
  set currentValue(value: number) { this._currentValue = value; }

  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }
}
