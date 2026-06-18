import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class RoleDefinition implements BaseEntity {
  private _id: number;
  private _name: string;
  private _description: string;
  private _permissionsCount: number;

  constructor(data: { id: number; name: string; description: string; permissionsCount: number }) {
    this._id = data.id;
    this._name = data.name;
    this._description = data.description;
    this._permissionsCount = data.permissionsCount;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }

  get permissionsCount(): number { return this._permissionsCount; }
  set permissionsCount(value: number) { this._permissionsCount = value; }
}
