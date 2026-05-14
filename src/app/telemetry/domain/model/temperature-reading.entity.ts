import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class TemperatureReading implements BaseEntity {
  private _id: number;
  private _date: string;
  private _lab01Value: number;
  private _lab02Value: number;

  constructor(data: { id: number; date: string; lab01Value: number; lab02Value: number }) {
    this._id = data.id;
    this._date = data.date;
    this._lab01Value = data.lab01Value;
    this._lab02Value = data.lab02Value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get date(): string {
    return this._date;
  }

  set date(value: string) {
    this._date = value;
  }

  get lab01Value(): number {
    return this._lab01Value;
  }

  set lab01Value(value: number) {
    this._lab01Value = value;
  }

  get lab02Value(): number {
    return this._lab02Value;
  }

  set lab02Value(value: number) {
    this._lab02Value = value;
  }

  getMaxTemperature(): number {
    return Math.max(this._lab01Value, this._lab02Value);
  }

  getMinTemperature(): number {
    return Math.min(this._lab01Value, this._lab02Value);
  }
}
