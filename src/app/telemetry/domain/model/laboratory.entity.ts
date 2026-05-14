import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type LaboratoryStatus = 'ALERT' | 'WARNING' | 'NORMAL';

export class Laboratory implements BaseEntity {
  private _id: number;
  private _name: string;
  private _type: string;
  private _temperature: number;
  private _status: LaboratoryStatus;

  constructor(data: { id: number; name: string; type: string; temperature: number; status: LaboratoryStatus }) {
    this._id = data.id;
    this._name = data.name;
    this._type = data.type;
    this._temperature = data.temperature;
    this._status = data.status;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get temperature(): number {
    return this._temperature;
  }

  set temperature(value: number) {
    this._temperature = value;
  }

  get status(): LaboratoryStatus {
    return this._status;
  }

  set status(value: LaboratoryStatus) {
    this._status = value;
  }

  isAlert(): boolean {
    return this._status === 'ALERT';
  }

  isWarning(): boolean {
    return this._status === 'WARNING';
  }

  isNormal(): boolean {
    return this._status === 'NORMAL';
  }

  getFormattedTemperature(): string {
    return `${this._temperature}°C`;
  }
}
