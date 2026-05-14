import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class SecurityAccess implements BaseEntity {
  private _id: number;
  private _permission: string;
  private _role: string;
  private _isGranted: boolean;
  private _lastAuditDate: string;

  constructor(data: { id: number; permission: string; role: string; isGranted: boolean; lastAuditDate: string }) {
    this._id = data.id;
    this._permission = data.permission;
    this._role = data.role;
    this._isGranted = data.isGranted;
    this._lastAuditDate = data.lastAuditDate;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get permission(): string { return this._permission; }
  set permission(value: string) { this._permission = value; }

  get role(): string { return this._role; }
  set role(value: string) { this._role = value; }

  get isGranted(): boolean { return this._isGranted; }
  set isGranted(value: boolean) { this._isGranted = value; }

  get lastAuditDate(): string { return this._lastAuditDate; }
  set lastAuditDate(value: string) { this._lastAuditDate = value; }
}
