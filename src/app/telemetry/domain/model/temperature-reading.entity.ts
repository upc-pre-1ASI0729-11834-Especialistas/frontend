import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class TemperatureReading implements BaseEntity {
  private _id: number;
  private _date: string;
  private _values: { [labId: string]: number };

  constructor(data: { id: number; date: string; values: { [labId: string]: number } }) {
    this._id = data.id;
    this._date = data.date;
    this._values = data.values || {};
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

  get values(): { [labId: string]: number } {
    return this._values;
  }

  set values(value: { [labId: string]: number }) {
    this._values = value;
  }

  get lab01Value(): number {
    const keys = Object.keys(this._values);
    return keys.length > 0 ? this._values[keys[0]] : 20.0;
  }

  set lab01Value(value: number) {
    const keys = Object.keys(this._values);
    if (keys.length > 0) {
      this._values[keys[0]] = value;
    }
  }

  get lab02Value(): number {
    const keys = Object.keys(this._values);
    return keys.length > 1 ? this._values[keys[1]] : 21.0;
  }

  set lab02Value(value: number) {
    const keys = Object.keys(this._values);
    if (keys.length > 1) {
      this._values[keys[1]] = value;
    }
  }

  getMaxTemperature(): number {
    const vals = Object.values(this._values);
    return vals.length > 0 ? Math.max(...vals) : 20.0;
  }

  getMinTemperature(): number {
    const vals = Object.values(this._values);
    return vals.length > 0 ? Math.min(...vals) : 20.0;
  }
}
