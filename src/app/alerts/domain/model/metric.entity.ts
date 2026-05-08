import { BaseEntity } from "../../../shared/domain/model/base-entity";

export class Metric implements BaseEntity {
  private _id: number;
  private _label: string;
  private _value: string;

  constructor(metric: { id: number; label: string; value: string }) {
    this._id = metric.id;
    this._label = metric.label;
    this._value = metric.value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }
}
