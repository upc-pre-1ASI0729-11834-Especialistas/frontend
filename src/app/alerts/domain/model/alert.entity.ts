import {BaseEntity} from '../../../shared/domain/model/base-entity';
import { Metric } from './metric.entity';

export class Alert implements BaseEntity {
  private _id: number;
  private _title: string;
  private _description: string;
  private _severity: string;
  private _status: string;
  private _metrics: Metric[];
  private _createdAt?: Date;
  private _laboratoryId?: number;
  private _labName?: string;
  private _labLocation?: string;
  private _sensorId?: number;
  private _sensorName?: string;

  constructor(fields: {
    id: number;
    title: string;
    description: string;
    severity: string;
    status: string;
    metrics: Metric[];
    createdAt?: Date;
    laboratoryId?: number;
    labName?: string;
    labLocation?: string;
    sensorId?: number;
    sensorName?: string;
  }) {
    this._id = fields.id;
    this._title = fields.title;
    this._description = fields.description;
    this._severity = fields.severity;
    this._status = fields.status;
    this._metrics = fields.metrics;
    this._createdAt = fields.createdAt;
    this._laboratoryId = fields.laboratoryId;
    this._labName = fields.labName;
    this._labLocation = fields.labLocation;
    this._sensorId = fields.sensorId;
    this._sensorName = fields.sensorName;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
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

  get metrics(): Metric[] {
    return this._metrics;
  }

  set metrics(value: Metric[]) {
    this._metrics = value;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  set createdAt(value: Date | undefined) {
    this._createdAt = value;
  }

  get laboratoryId(): number | undefined {
    return this._laboratoryId;
  }

  set laboratoryId(value: number | undefined) {
    this._laboratoryId = value;
  }

  get labName(): string | undefined {
    return this._labName;
  }

  set labName(value: string | undefined) {
    this._labName = value;
  }

  get labLocation(): string | undefined {
    return this._labLocation;
  }

  set labLocation(value: string | undefined) {
    this._labLocation = value;
  }

  get sensorId(): number | undefined {
    return this._sensorId;
  }

  set sensorId(value: number | undefined) {
    this._sensorId = value;
  }

  get sensorName(): string | undefined {
    return this._sensorName;
  }

  set sensorName(value: string | undefined) {
    this._sensorName = value;
  }
}
