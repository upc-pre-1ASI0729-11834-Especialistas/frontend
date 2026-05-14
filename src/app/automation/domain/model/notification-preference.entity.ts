import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class NotificationPreference implements BaseEntity {
  private _id: number;
  private _channel: string;
  private _isEnabled: boolean;
  private _threshold: string;
  private _description: string;

  constructor(data: { id: number; channel: string; isEnabled: boolean; threshold: string; description: string }) {
    this._id = data.id;
    this._channel = data.channel;
    this._isEnabled = data.isEnabled;
    this._threshold = data.threshold;
    this._description = data.description;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get channel(): string { return this._channel; }
  set channel(value: string) { this._channel = value; }

  get isEnabled(): boolean { return this._isEnabled; }
  set isEnabled(value: boolean) { this._isEnabled = value; }

  get threshold(): string { return this._threshold; }
  set threshold(value: string) { this._threshold = value; }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }
}
