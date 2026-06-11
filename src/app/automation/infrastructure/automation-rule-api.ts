import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { AutomationRule } from '../domain/model/automation-rule.entity';
import { AutomationRulesApiEndpoint } from './automation-rule-api-endpoint';

@Injectable({ providedIn: 'root' })
export class AutomationRulesApi extends BaseApi {
  private readonly automationRulesEndpoint: AutomationRulesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.automationRulesEndpoint = new AutomationRulesApiEndpoint(http);
  }

  getAutomationRules(): Observable<AutomationRule[]> {
    return this.automationRulesEndpoint.getAll();
  }

  createAutomationRule(automationRule: AutomationRule): Observable<AutomationRule> {
    return this.automationRulesEndpoint.create(automationRule);
  }

  updateAutomationRule(id: number, automationRule: AutomationRule): Observable<AutomationRule> {
    return this.automationRulesEndpoint.update(automationRule, id);
  }

  deleteAutomationRule(id: number): Observable<void> {
    return this.automationRulesEndpoint.delete(id);
  }
}
