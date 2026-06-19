import { Component, inject, OnInit, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutomationStore } from '../../../application/automation.store';
import { LaboratoryApi } from '../../../../labs/infrastructure/laboratory-api';
import { TopbarActionService } from '../../../../shared/application/topbar-action.service';
import { AutomationRuleCardComponent } from '../../components/automation-rule-card/automation-rule-card.component';
import { CreateRuleDialog } from '../../components/create-rule-dialog/create-rule-dialog';
import { Laboratory } from '../../../../labs/domain/model/laboratory.entity';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-automation-rules-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    AutomationRuleCardComponent,
    TranslateModule
  ],
  templateUrl: './automation-rules-page.component.html',
  styleUrl: './automation-rules-page.component.css'
})
export class AutomationRulesPageComponent implements OnInit {
  protected readonly automationStore = inject(AutomationStore);
  private readonly laboratoryApi = inject(LaboratoryApi);
  private readonly dialog = inject(MatDialog);
  private readonly topbarActionService = inject(TopbarActionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);

  readonly labs = signal<Laboratory[]>([]);

  constructor() {
    this.topbarActionService.setAction({
      label: this.translateService.instant('settingsPage.automationRules.createRule') || 'Create New Rule',
      icon: 'add',
      id: 'add-rule-action'
    });

    this.translateService.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.topbarActionService.setAction({
        label: this.translateService.instant('settingsPage.automationRules.createRule') || 'Create New Rule',
        icon: 'add',
        id: 'add-rule-action'
      });
    });

    this.topbarActionService.actionClicked$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.openCreateRuleDialog();
      });
  }

  ngOnInit(): void {
    this.loadLabs();
  }

  private loadLabs(): void {
    this.laboratoryApi.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.labs.set(data),
        error: (err) => console.error('Failed to load labs for automation scope:', err)
      });
  }

  onToggleActive(event: { id: number; active: boolean }): void {
    this.automationStore.updateAutomationRule(event.id, { active: event.active }).subscribe({
      next: (res) => {
        console.log('Successfully updated rule active state:', res);
      },
      error: (err) => {
        console.error('Failed to toggle rule active state:', err);
      }
    });
  }

  openCreateRuleDialog(): void {
    const dialogRef = this.dialog.open(CreateRuleDialog, {
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '400px',
      panelClass: 'side-sheet-dialog',
      data: { labs: this.labs() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.automationStore.createAutomationRule(result).subscribe({
          next: (res) => {
            console.log('Successfully created rule:', res);
          },
          error: (err) => {
            console.error('Failed to create rule:', err);
          }
        });
      }
    });
  }
}
