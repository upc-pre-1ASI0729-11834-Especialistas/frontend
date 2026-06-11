import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface AutomationRuleResource extends BaseResource {
  id: number;
  name: string;
  active: boolean;
  lastTriggered: string;
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
}

export interface AutomationRulesResponse extends BaseResponse {
  automationRules: AutomationRuleResource[];
}
