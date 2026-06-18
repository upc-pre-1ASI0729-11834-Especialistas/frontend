import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-rule-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-rule-dialog.html',
  styleUrl: './create-rule-dialog.css'
})
export class CreateRuleDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<CreateRuleDialog>);

  readonly ruleForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    triggerMetric: ['Temperature', Validators.required],
    triggerOperator: ['>', Validators.required],
    triggerValue: [null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    triggerUnit: ['°C'],
    triggerDuration: [5, [Validators.required, Validators.min(0)]],
    scope: ['all', Validators.required],
    specificLabId: [null],
    actionHvac: [false],
    actionPush: [false],
    actionSms: [false],
    actionLog: [false],
    executionLimitMins: [60, [Validators.required, Validators.min(1)]],
    autoResolve: [true]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { labs: any[] }
  ) {}

  ngOnInit() {
    // Dynamically update triggerUnit based on triggerMetric
    this.ruleForm.get('triggerMetric')?.valueChanges.subscribe(metric => {
      let unit = '';
      if (metric === 'Temperature') unit = '°C';
      else if (metric === 'Humidity') unit = '%';
      else if (metric === 'CO2') unit = 'ppm';
      this.ruleForm.get('triggerUnit')?.setValue(unit);
    });

    // Handle scope conditional validator for specificLabId
    this.ruleForm.get('scope')?.valueChanges.subscribe(scope => {
      const labControl = this.ruleForm.get('specificLabId');
      if (scope === 'specific') {
        labControl?.setValidators(Validators.required);
      } else {
        labControl?.clearValidators();
        labControl?.setValue(null);
      }
      labControl?.updateValueAndValidity();
    });
  }

  get unitSuffix(): string {
    const metric = this.ruleForm.get('triggerMetric')?.value;
    if (metric === 'Temperature') return '°C';
    if (metric === 'Humidity') return '%';
    if (metric === 'CO2') return 'ppm';
    return '';
  }

  onSubmit() {
    if (this.ruleForm.valid) {
      const formVal = this.ruleForm.value;
      const actions: string[] = [];
      if (formVal.actionHvac) actions.push('activate_hvac');
      if (formVal.actionPush) actions.push('send_push');
      if (formVal.actionSms) actions.push('send_sms');
      if (formVal.actionLog) actions.push('log_event');

      const result = {
        name: formVal.name,
        active: true,
        lastTriggered: null,
        triggerMetric: formVal.triggerMetric,
        triggerOperator: formVal.triggerOperator,
        triggerValue: Number(formVal.triggerValue),
        triggerUnit: formVal.triggerUnit,
        triggerDuration: Number(formVal.triggerDuration),
        scope: formVal.scope,
        specificLabId: formVal.scope === 'specific' ? Number(formVal.specificLabId) : null,
        actions: actions,
        executionLimitMins: Number(formVal.executionLimitMins),
        autoResolve: formVal.autoResolve
      };

      this.dialogRef.close(result);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
