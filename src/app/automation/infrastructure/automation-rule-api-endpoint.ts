import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { AutomationRule } from '../domain/model/automation-rule.entity';
import { AutomationRuleResource, AutomationRulesResponse } from './automation-rule-response';
import { AutomationRuleAssembler } from './automation-rule-assembler';

const automationRulesEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAutomationAutomationRulesEndpointPath}`;

export class AutomationRulesApiEndpoint extends BaseApiEndpoint<
  AutomationRule,
  AutomationRuleResource,
  AutomationRulesResponse,
  AutomationRuleAssembler
> {
  constructor(http: HttpClient) {
    super(http, automationRulesEndpointUrl, new AutomationRuleAssembler());
  }
}
