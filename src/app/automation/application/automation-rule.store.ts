import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
import { AutomationRule } from '../domain/model/automation-rule.entity';
import { AutomationRulesApi } from '../infrastructure/automation-rule-api';

@Injectable({ providedIn: 'root' })
export class AutomationRuleStore {
  private readonly destroyRef = inject(DestroyRef);

  private readonly automationRulesSignal = signal<AutomationRule[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly automationRules = this.automationRulesSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly automationRulesCount = computed(() => this.automationRules().length);

  constructor(private readonly automationRulesApi: AutomationRulesApi) {}

  getAutomationRuleById(id: number | null | undefined): Signal<AutomationRule | undefined> {
    return computed(() => id ? this.automationRules().find(r => r.id === id) : undefined);
  }

  loadAutomationRules(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.automationRulesApi.getAutomationRules().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.automationRulesSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => this.handleError(err, 'Failed to load automation rules')
    });
  }

  createAutomationRule(data: {
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
  }): Observable<AutomationRule> {
    this.loadingSignal.set(true);
    const newRule = new AutomationRule({
      id: 0,
      name: data.name,
      active: data.active,
      lastTriggered: data.lastTriggered,
      triggerMetric: data.triggerMetric,
      triggerOperator: data.triggerOperator,
      triggerValue: data.triggerValue,
      triggerUnit: data.triggerUnit,
      triggerDuration: data.triggerDuration,
      scope: data.scope,
      specificLabId: data.specificLabId,
      actions: data.actions,
      executionLimitMins: data.executionLimitMins,
      autoResolve: data.autoResolve
    });

    return this.automationRulesApi.createAutomationRule(newRule).pipe(
      tap({
        next: saved => {
          this.automationRulesSignal.update(list => [...list, saved]);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.handleError(err, 'Failed to create automation rule');
        }
      })
    );
  }

  updateAutomationRule(id: number, data: Partial<{
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
  }>): Observable<AutomationRule> {
    this.loadingSignal.set(true);
    const currentList = this.automationRules();
    const existing = currentList.find(r => r.id === id);
    if (!existing) {
      throw new Error(`AutomationRule with id ${id} not found`);
    }

    const updatedEntity = new AutomationRule({
      id: existing.id,
      name: data.name !== undefined ? data.name : existing.name,
      active: data.active !== undefined ? data.active : existing.active,
      lastTriggered: data.lastTriggered !== undefined ? data.lastTriggered : existing.lastTriggered,
      triggerMetric: data.triggerMetric !== undefined ? data.triggerMetric : existing.triggerMetric,
      triggerOperator: data.triggerOperator !== undefined ? data.triggerOperator : existing.triggerOperator,
      triggerValue: data.triggerValue !== undefined ? data.triggerValue : existing.triggerValue,
      triggerUnit: data.triggerUnit !== undefined ? data.triggerUnit : existing.triggerUnit,
      triggerDuration: data.triggerDuration !== undefined ? data.triggerDuration : existing.triggerDuration,
      scope: data.scope !== undefined ? data.scope : existing.scope,
      specificLabId: data.specificLabId !== undefined ? data.specificLabId : existing.specificLabId,
      actions: data.actions !== undefined ? data.actions : existing.actions,
      executionLimitMins: data.executionLimitMins !== undefined ? data.executionLimitMins : existing.executionLimitMins,
      autoResolve: data.autoResolve !== undefined ? data.autoResolve : existing.autoResolve
    });

    return this.automationRulesApi.updateAutomationRule(id, updatedEntity).pipe(
      tap({
        next: saved => {
          this.automationRulesSignal.update(list =>
            list.map(item => item.id === id ? saved : item)
          );
          this.loadingSignal.set(false);
        },
        error: err => {
          this.handleError(err, 'Failed to update automation rule');
        }
      })
    );
  }

  private handleError(error: any, fallback: string): void {
    this.errorSignal.set(error instanceof Error ? error.message : fallback);
    this.loadingSignal.set(false);
  }
}
