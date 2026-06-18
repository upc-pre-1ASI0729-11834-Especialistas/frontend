import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class AutomationRule implements BaseEntity {
  private _id: number;
  private _name: string;
  private _active: boolean;
  private _lastTriggered: string | null;
  private _triggerMetric: string;
  private _triggerOperator: string;
  private _triggerValue: number;
  private _triggerUnit: string;
  private _triggerDuration: number;
  private _scope: 'all' | 'specific';
  private _specificLabId: number | null;
  private _actions: string[];
  private _executionLimitMins: number;
  private _autoResolve: boolean;

  constructor(data: {
    id: number;
    name: string;
    active: boolean;
    lastTriggered: string | null;
    triggerMetric: string;
    triggerOperator: string;
    triggerValue: number;
    triggerUnit: string;
    triggerDuration: number;
    scope: 'all' | 'specific';
    specificLabId: number | null;
    actions: string[];
    executionLimitMins: number;
    autoResolve: boolean;
  }) {
    this._id = data.id;
    this._name = data.name;
    this._active = data.active;
    this._lastTriggered = data.lastTriggered;
    this._triggerMetric = data.triggerMetric;
    this._triggerOperator = data.triggerOperator;
    this._triggerValue = data.triggerValue;
    this._triggerUnit = data.triggerUnit;
    this._triggerDuration = data.triggerDuration;
    this._scope = data.scope;
    this._specificLabId = data.specificLabId;
    this._actions = data.actions;
    this._executionLimitMins = data.executionLimitMins;
    this._autoResolve = data.autoResolve;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get active(): boolean { return this._active; }
  set active(value: boolean) { this._active = value; }

  get lastTriggered(): string | null { return this._lastTriggered; }
  set lastTriggered(value: string | null) { this._lastTriggered = value; }

  get triggerMetric(): string { return this._triggerMetric; }
  set triggerMetric(value: string) { this._triggerMetric = value; }

  get triggerOperator(): string { return this._triggerOperator; }
  set triggerOperator(value: string) { this._triggerOperator = value; }

  get triggerValue(): number { return this._triggerValue; }
  set triggerValue(value: number) { this._triggerValue = value; }

  get triggerUnit(): string { return this._triggerUnit; }
  set triggerUnit(value: string) { this._triggerUnit = value; }

  get triggerDuration(): number { return this._triggerDuration; }
  set triggerDuration(value: number) { this._triggerDuration = value; }

  get scope(): 'all' | 'specific' { return this._scope; }
  set scope(value: 'all' | 'specific') { this._scope = value; }

  get specificLabId(): number | null { return this._specificLabId; }
  set specificLabId(value: number | null) { this._specificLabId = value; }

  get actions(): string[] { return this._actions; }
  set actions(value: string[]) { this._actions = value; }

  get executionLimitMins(): number { return this._executionLimitMins; }
  set executionLimitMins(value: number) { this._executionLimitMins = value; }

  get autoResolve(): boolean { return this._autoResolve; }
  set autoResolve(value: boolean) { this._autoResolve = value; }
}
