import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class PendingInvitation implements BaseEntity {
  private _id: number;
  private _email: string;
  private _role: string;
  private _sentTimeAgo: string;
  private _laboratoryIds: number[];
  private _workspaceId?: number;
  private _workspaceName?: string;

  constructor(data: {
    id: number;
    email: string;
    role: string;
    sentTimeAgo: string;
    laboratoryIds?: number[];
    workspaceId?: number;
    workspaceName?: string;
  }) {
    this._id = data.id;
    this._email = data.email;
    this._role = data.role;
    this._sentTimeAgo = data.sentTimeAgo;
    this._laboratoryIds = data.laboratoryIds || [];
    this._workspaceId = data.workspaceId;
    this._workspaceName = data.workspaceName;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get role(): string { return this._role; }
  set role(value: string) { this._role = value; }

  get sentTimeAgo(): string { return this._sentTimeAgo; }
  set sentTimeAgo(value: string) { this._sentTimeAgo = value; }

  get laboratoryIds(): number[] { return this._laboratoryIds; }
  set laboratoryIds(value: number[]) { this._laboratoryIds = value; }

  get workspaceId(): number | undefined { return this._workspaceId; }
  set workspaceId(value: number | undefined) { this._workspaceId = value; }

  get workspaceName(): string | undefined { return this._workspaceName; }
  set workspaceName(value: string | undefined) { this._workspaceName = value; }
}
