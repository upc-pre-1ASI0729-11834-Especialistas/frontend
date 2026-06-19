import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LaboratoryApi } from '../../../../labs/infrastructure/laboratory-api';
import { Laboratory } from '../../../../labs/domain/model/laboratory.entity';

@Component({
  selector: 'app-invite-user-dialog',
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
    ReactiveFormsModule
  ],
  templateUrl: './invite-user-dialog.html',
  styleUrl: './invite-user-dialog.css'
})
export class InviteUserDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly laboratoryApi = inject(LaboratoryApi);
  readonly dialogRef = inject(MatDialogRef<InviteUserDialog>);

  readonly laboratories = signal<Laboratory[]>([]);

  readonly inviteForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    labs: this.fb.group({
      allLabs: [false]
    }),
    message: ['']
  });

  ngOnInit() {
    this.laboratoryApi.getAll().subscribe(labs => {
      this.laboratories.set(labs);

      const labsGroup = this.inviteForm.get('labs') as FormGroup;
      labs.forEach(lab => {
        labsGroup.addControl(lab.id.toString(), this.fb.control(false));
      });

      this.setupListeners();
    });
  }

  private setupListeners() {
    const labsGroup = this.inviteForm.get('labs') as FormGroup;
    const allLabsControl = labsGroup.get('allLabs');
    const labControls = Object.keys(labsGroup.controls).filter(key => key !== 'allLabs');

    // Toggle all checkboxes when All Labs is checked
    allLabsControl?.valueChanges.subscribe(checked => {
      labControls.forEach(key => {
        labsGroup.get(key)?.setValue(checked, { emitEvent: false });
      });
    });

    // If individual lab changes
    labControls.forEach(key => {
      labsGroup.get(key)?.valueChanges.subscribe(checked => {
        if (!checked) {
          allLabsControl?.setValue(false, { emitEvent: false });
        } else {
          const allChecked = labControls.every(k => labsGroup.get(k)?.value === true);
          if (allChecked) {
            allLabsControl?.setValue(true, { emitEvent: false });
          }
        }
      });
    });
  }

  onSubmit() {
    if (this.inviteForm.valid) {
      const formVal = this.inviteForm.value;
      const selectedLabIds: number[] = [];
      const labs = this.laboratories();
      if (formVal.labs?.allLabs) {
        labs.forEach(l => selectedLabIds.push(l.id));
      } else if (formVal.labs) {
        Object.keys(formVal.labs).forEach(key => {
          if (key !== 'allLabs' && formVal.labs[key] === true) {
            selectedLabIds.push(Number(key));
          }
        });
      }
      this.dialogRef.close({
        email: formVal.email,
        role: formVal.role,
        laboratoryIds: selectedLabIds
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
