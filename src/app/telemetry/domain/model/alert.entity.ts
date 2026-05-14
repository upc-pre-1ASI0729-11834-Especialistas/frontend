import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'RESOLVED';

export class Alert implements BaseEntity {
  private _id: number;
  private _labName: string;
  private _title: string;
  private _description: string;
  private _severity: AlertSeverity;
  private _timeAgo: string;

  constructor(data: { id: number; labName: string; title: string; description: string; severity: AlertSeverity; timeAgo: string }) {
    this._id = data.id;
    this._labName = data.labName;
    this._title = data.title;
    this._description = data.description;
    this._severity = data.severity;
    this._timeAgo = data.timeAgo;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get labName(): string {
    return this._labName;
  }

  set labName(value: string) {
    this._labName = value;
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

  get severity(): AlertSeverity {
    return this._severity;
  }

  set severity(value: AlertSeverity) {
    this._severity = value;
  }

  get timeAgo(): string {
    return this._timeAgo;
  }

  set timeAgo(value: string) {
    this._timeAgo = value;
  }

  isCritical(): boolean {
    return this._severity === 'CRITICAL';
  }

  isWarning(): boolean {
    return this._severity === 'WARNING';
  }

  isResolved(): boolean {
    return this._severity === 'RESOLVED';
  }
}
