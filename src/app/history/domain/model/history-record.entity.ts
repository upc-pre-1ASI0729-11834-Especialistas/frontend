import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class HistoryRecord implements BaseEntity {
  private _id: number;
  private _name: string;
  private _description: string;
  private _occurredAt: string;
  private _lab: string;
  private _eventType: string;
  private _severity: string;
  private _status: string;

  constructor(record: {
    id: number;
    name: string;
    description: string;
    occurredAt: string;
    lab: string;
    eventType: string;
    severity: string;
    status: string;
  }) {
    this._id = record.id;
    this._name = record.name;
    this._description = record.description;
    this._occurredAt = record.occurredAt;
    this._lab = record.lab;
    this._eventType = record.eventType;
    this._severity = record.severity;
    this._status = record.status;
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

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get occurredAt(): string {
    return this._occurredAt;
  }

  set occurredAt(value: string) {
    this._occurredAt = value;
  }

  get lab(): string {
    return this._lab;
  }

  set lab(value: string) {
    this._lab = value;
  }

  get eventType(): string {
    return this._eventType;
  }

  set eventType(value: string) {
    this._eventType = value;
  }

  get severity(): string {
    return this._severity;
  }

  set severity(value: string) {
    this._severity = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }
}

