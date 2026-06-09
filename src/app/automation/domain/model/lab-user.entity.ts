import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class LabUser implements BaseEntity {
  private _id: number;
  private _fullName: string;
  private _email: string;
  private _role: string;
  private _labsAccess: string;
  private _lastLogin: string;
  private _status: string;
  private _avatarInitials: string;
  private _avatarColor: string;

  constructor(data: { id: number; fullName: string; email: string; role: string; labsAccess: string; lastLogin: string; status: string; avatarInitials: string; avatarColor: string }) {
    this._id = data.id;
    this._fullName = data.fullName;
    this._email = data.email;
    this._role = data.role;
    this._labsAccess = data.labsAccess;
    this._lastLogin = data.lastLogin;
    this._status = data.status;
    this._avatarInitials = data.avatarInitials;
    this._avatarColor = data.avatarColor;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get fullName(): string { return this._fullName; }
  set fullName(value: string) { this._fullName = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get role(): string { return this._role; }
  set role(value: string) { this._role = value; }

  get labsAccess(): string { return this._labsAccess; }
  set labsAccess(value: string) { this._labsAccess = value; }

  get lastLogin(): string { return this._lastLogin; }
  set lastLogin(value: string) { this._lastLogin = value; }

  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }

  get avatarInitials(): string { return this._avatarInitials; }
  set avatarInitials(value: string) { this._avatarInitials = value; }

  get avatarColor(): string { return this._avatarColor; }
  set avatarColor(value: string) { this._avatarColor = value; }
}
