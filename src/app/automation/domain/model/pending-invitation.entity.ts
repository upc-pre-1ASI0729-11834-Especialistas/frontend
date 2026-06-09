import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class PendingInvitation implements BaseEntity {
  private _id: number;
  private _email: string;
  private _role: string;
  private _sentTimeAgo: string;

  constructor(data: { id: number; email: string; role: string; sentTimeAgo: string }) {
    this._id = data.id;
    this._email = data.email;
    this._role = data.role;
    this._sentTimeAgo = data.sentTimeAgo;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get role(): string { return this._role; }
  set role(value: string) { this._role = value; }

  get sentTimeAgo(): string { return this._sentTimeAgo; }
  set sentTimeAgo(value: string) { this._sentTimeAgo = value; }
}
