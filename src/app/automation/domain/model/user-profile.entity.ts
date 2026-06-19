import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class UserProfile implements BaseEntity {
  private _id: number;
  private _fullName: string;
  private _role: string;
  private _email: string;
  private _avatarUrl: string;
  private _phoneNumber: string;
  private _professionalTitle: string;
  private _employeeId: string;
  private _systemState: string;
  private _accessTier: string;
  private _defaultStartShift: string;
  private _shiftDuration: string;
  private _autoGenerateShiftReport: boolean;
  private _laboratoryIds: number[];

  constructor(data: {
    id: number;
    fullName: string;
    role: string;
    email: string;
    avatarUrl: string;
    phoneNumber?: string;
    professionalTitle?: string;
    employeeId?: string;
    systemState?: string;
    accessTier?: string;
    defaultStartShift?: string;
    shiftDuration?: string;
    autoGenerateShiftReport?: boolean;
    laboratoryIds?: number[];
  }) {
    this._id = data.id;
    this._fullName = data.fullName;
    this._role = data.role;
    this._email = data.email;
    this._avatarUrl = data.avatarUrl;
    this._phoneNumber = data.phoneNumber ?? '';
    this._professionalTitle = data.professionalTitle ?? '';
    this._employeeId = data.employeeId ?? '';
    this._systemState = data.systemState ?? 'Active';
    this._accessTier = data.accessTier ?? '';
    this._defaultStartShift = data.defaultStartShift ?? '08:00 AM';
    this._shiftDuration = data.shiftDuration ?? '8 Hours';
    this._autoGenerateShiftReport = data.autoGenerateShiftReport ?? false;
    this._laboratoryIds = data.laboratoryIds ?? [];
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

  get phoneNumber(): string { return this._phoneNumber; }
  set phoneNumber(value: string) { this._phoneNumber = value; }

  get professionalTitle(): string { return this._professionalTitle; }
  set professionalTitle(value: string) { this._professionalTitle = value; }

  get employeeId(): string { return this._employeeId; }
  set employeeId(value: string) { this._employeeId = value; }

  get systemState(): string { return this._systemState; }
  set systemState(value: string) { this._systemState = value; }

  get accessTier(): string { return this._accessTier; }
  set accessTier(value: string) { this._accessTier = value; }

  get defaultStartShift(): string { return this._defaultStartShift; }
  set defaultStartShift(value: string) { this._defaultStartShift = value; }

  get shiftDuration(): string { return this._shiftDuration; }
  set shiftDuration(value: string) { this._shiftDuration = value; }

  get autoGenerateShiftReport(): boolean { return this._autoGenerateShiftReport; }
  set autoGenerateShiftReport(value: boolean) { this._autoGenerateShiftReport = value; }

  get laboratoryIds(): number[] { return this._laboratoryIds; }
  set laboratoryIds(value: number[]) { this._laboratoryIds = value; }
}
