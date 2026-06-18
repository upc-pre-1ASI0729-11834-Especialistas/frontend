import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AutomationStore } from '../../../../../../automation/application/automation.store';
import { AutomationRule } from '../../../../../../automation/domain/model/automation-rule.entity';

@Component({
  selector: 'app-laboratory-schedules',
  imports: [RouterLink],
  templateUrl: './laboratory-schedules.component.html',
  styleUrl: './laboratory-schedules.component.css',
})
export class LaboratorySchedulesComponent {
  readonly laboratoryId = input.required<number>();
  protected readonly automationStore = inject(AutomationStore);

  readonly filteredRules = computed(() => {
    const labId = this.laboratoryId();
    return this.automationStore.automationRules().filter(
      rule => rule.scope === 'all' || (rule.scope === 'specific' && Number(rule.specificLabId) === labId)
    );
  });

  toggleRuleActive(rule: AutomationRule): void {
    this.automationStore.updateAutomationRule(rule.id, { active: !rule.active }).subscribe({
      next: (res) => {
        console.log('Successfully updated rule active state:', res);
      },
      error: (err) => {
        console.error('Failed to toggle rule active state:', err);
      }
    });
  }
}
