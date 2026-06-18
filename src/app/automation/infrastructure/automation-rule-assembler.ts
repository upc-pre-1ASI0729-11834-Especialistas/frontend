import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AutomationRule } from '../domain/model/automation-rule.entity';
import { AutomationRuleResource, AutomationRulesResponse } from './automation-rule-response';

export class AutomationRuleAssembler implements BaseAssembler<AutomationRule, AutomationRuleResource, AutomationRulesResponse> {
  toEntitiesFromResponse(response: AutomationRulesResponse): AutomationRule[] {
    const resources = response.automationRules || (response as any) || [];
    return resources.map((resource: any) => this.toEntityFromResource(resource as AutomationRuleResource));
  }

  toEntityFromResource(resource: AutomationRuleResource): AutomationRule {
    return new AutomationRule({
      id: resource.id,
      name: resource.name,
      active: resource.active,
      lastTriggered: resource.lastTriggered,
      triggerMetric: resource.triggerMetric,
      triggerOperator: resource.triggerOperator,
      triggerValue: resource.triggerValue,
      triggerUnit: resource.triggerUnit,
      triggerDuration: resource.triggerDuration,
      scope: resource.scope,
      specificLabId: resource.specificLabId,
      actions: resource.actions,
      executionLimitMins: resource.executionLimitMins,
      autoResolve: resource.autoResolve
    });
  }

  toResourceFromEntity(entity: AutomationRule): AutomationRuleResource {
    return {
      id: entity.id,
      name: entity.name,
      active: entity.active,
      lastTriggered: entity.lastTriggered,
      triggerMetric: entity.triggerMetric,
      triggerOperator: entity.triggerOperator,
      triggerValue: entity.triggerValue,
      triggerUnit: entity.triggerUnit,
      triggerDuration: entity.triggerDuration,
      scope: entity.scope,
      specificLabId: entity.specificLabId,
      actions: entity.actions,
      executionLimitMins: entity.executionLimitMins,
      autoResolve: entity.autoResolve
    };
  }
}
