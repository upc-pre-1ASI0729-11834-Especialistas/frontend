import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class UserProfile implements BaseEntity {
  private _id: number;
  private _fullName: string;
  private _role: string;
  private _email: string;
  private _avatarUrl: string;

  constructor(data: { id: number; fullName: string; role: string; email: string; avatarUrl: string }) {
    this._id = data.id;
    this._fullName = data.fullName;
    this._role = data.role;
    this._email = data.email;
    this._avatarUrl = data.avatarUrl;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get fullName(): string { return this._fullName; }
  set fullName(value: string) { this._fullName = value; }

  get role(): string { return this._role; }
  set role(value: string) { this._role = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get avatarUrl(): string { return this._avatarUrl; }
  set avatarUrl(value: string) { this._avatarUrl = value; }
}
