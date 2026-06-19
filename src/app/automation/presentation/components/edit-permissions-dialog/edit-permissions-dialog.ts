import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LaboratoryApi } from '../../../../labs/infrastructure/laboratory-api';
import { Laboratory } from '../../../../labs/domain/model/laboratory.entity';
import { UserProfile } from '../../../domain/model/user-profile.entity';

@Component({
  selector: 'app-edit-permissions-dialog',
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
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 mat-dialog-title>Editar Permisos</h2>
        <button mat-icon-button (click)="onCancel()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-subtitle">
        <p class="user-name">{{ user.fullName }}</p>
        <p class="user-email">{{ user.email }}</p>
      </div>

      <form [formGroup]="editForm" (ngSubmit)="onSubmit()" class="dialog-form">
        <div class="form-content">
          <!-- Role Selector -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Rol en el Workspace</mat-label>
            <mat-select formControlName="role">
              <mat-option value="Administrator">Administrator</mat-option>
              <mat-option value="Safety Coordinator">Safety Coordinator</mat-option>
              <mat-option value="Lab Technician">Lab Technician</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Labs List Checkboxes -->
          <div class="labs-section" formGroupName="labs">
            <p class="section-title">Permisos de Laboratorios</p>
            
            <mat-checkbox formControlName="allLabs" class="lab-checkbox all-labs-checkbox">
              <strong>Seleccionar todos</strong>
            </mat-checkbox>

            <div class="labs-list">
              @for (lab of laboratories(); track lab.id) {
                <mat-checkbox [formControlName]="lab.id.toString()" class="lab-checkbox">
                  {{ lab.name }}
                </mat-checkbox>
              }
            </div>
          </div>
        </div>

        <div class="dialog-actions">
          <button mat-button type="button" (click)="onCancel()">Cancelar</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="editForm.invalid">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
      padding: 24px;
      background: #fff;
    }
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
    }
    .close-btn {
      color: #94a3b8;
    }
    .dialog-subtitle {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f1f5f9;
    }
    .user-name {
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 2px;
    }
    .user-email {
      font-size: 13px;
      color: #64748b;
      margin: 0;
    }
    .dialog-form {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }
    .form-content {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
      padding-right: 4px;
    }
    .full-width {
      width: 100%;
    }
    .labs-section {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
    }
    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .labs-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 8px;
      padding-left: 4px;
    }
    .lab-checkbox {
      font-size: 14px;
      color: #334155;
    }
    .all-labs-checkbox {
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
    }
  `]
})
export class EditPermissionsDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly laboratoryApi = inject(LaboratoryApi);
  readonly dialogRef = inject(MatDialogRef<EditPermissionsDialog>);
  readonly user = inject<UserProfile>(MAT_DIALOG_DATA);

  readonly laboratories = signal<Laboratory[]>([]);

  readonly editForm: FormGroup = this.fb.group({
    role: [this.user.role, Validators.required],
    labs: this.fb.group({
      allLabs: [false]
    })
  });

  ngOnInit() {
    this.laboratoryApi.getAll().subscribe(labs => {
      this.laboratories.set(labs);

      const labsGroup = this.editForm.get('labs') as FormGroup;
      const userLabIds = this.user.laboratoryIds || [];

      labs.forEach(lab => {
        const isChecked = userLabIds.includes(lab.id);
        labsGroup.addControl(lab.id.toString(), this.fb.control(isChecked));
      });

      // Check if all are checked initially
      const allChecked = labs.length > 0 && labs.every(l => userLabIds.includes(l.id));
      labsGroup.get('allLabs')?.setValue(allChecked, { emitEvent: false });

      this.setupListeners();
    });
  }

  private setupListeners() {
    const labsGroup = this.editForm.get('labs') as FormGroup;
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
    if (this.editForm.valid) {
      const formVal = this.editForm.value;
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
        role: formVal.role,
        laboratoryIds: selectedLabIds
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
