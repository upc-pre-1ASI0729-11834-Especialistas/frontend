import {BaseEntity} from '../../../shared/domain/model/base-entity';
import { Metric } from './metric.entity';

export class Alert implements BaseEntity {
  private _id: number;
  private _title: string;
  private _description: string;
  private _severity: string;
  private _status: string;
  private _metrics: Metric[];

  constructor(course: { id: number; title: string; description: string; severity: string; status: string; metrics: Metric[] }) {
    this._id = course.id;
    this._title = course.title;
    this._description = course.description;
    this._severity = course.severity;
    this._status = course.status;
    this._metrics = course.metrics;
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
}
