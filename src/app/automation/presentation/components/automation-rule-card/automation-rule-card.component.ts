import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { AutomationRule } from '../../../domain/model/automation-rule.entity';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-automation-rule-card',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatIconModule, TranslateModule],
  templateUrl: './automation-rule-card.component.html',
  styleUrls: ['./automation-rule-card.component.css']
})
export class AutomationRuleCardComponent {
  private readonly translateService = inject(TranslateService);

  @Input({ required: true }) rule!: AutomationRule;
  @Input() labs: any[] = [];
  @Output() toggleActive = new EventEmitter<{ id: number; active: boolean }>();

  getIcon(): string {
    const metric = this.rule.triggerMetric.toLowerCase();
    if (metric.includes('temp')) return 'thermostat';
    if (metric.includes('co2') || metric.includes('air')) return 'air';
    if (metric.includes('humid') || metric.includes('water')) return 'water_drop';
    return 'settings_suggest';
  }

  getLabName(): string {
    if (this.rule.scope === 'all') return 'All labs';
    if (!this.rule.specificLabId) return 'Specific lab';
    const lab = this.labs.find(l => l.id === Number(this.rule.specificLabId));
    if (lab) return lab.name;
    const labLabel = this.translateService.instant('history.drawer.lab');
    return `${labLabel} (ID: ${this.rule.specificLabId})`;
  }

  getFormattedAction(): string {
    const actionMap: { [key: string]: string } = {
      'activate_hvac': 'Activate HVAC cooling boost',
      'increase_ventilation': 'Increase ventilation',
      'send_sms': 'Send SMS to on-call coordinator',
      'send_push': 'Send Push Notification',
      'log_event': 'Log event with LOW priority'
    };
    return this.rule.actions.map(a => actionMap[a] || a).join(' + ');
  }

  onToggleChange(checked: boolean): void {
    this.toggleActive.emit({ id: this.rule.id, active: checked });
  }
}
