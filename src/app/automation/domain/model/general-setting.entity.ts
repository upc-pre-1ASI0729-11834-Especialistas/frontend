import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class GeneralSetting implements BaseEntity {
  private _id: number;
  private _key: string;
  private _value: string;
  private _category: string;
  private _description: string;

  constructor(data: { id: number; key: string; value: string; category: string; description: string }) {
    this._id = data.id;
    this._key = data.key;
    this._value = data.value;
    this._category = data.category;
    this._description = data.description;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get key(): string { return this._key; }
  set key(value: string) { this._key = value; }

  get value(): string { return this._value; }
  set value(v: string) { this._value = v; }

  get category(): string { return this._category; }
  set category(value: string) { this._category = value; }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }
}
