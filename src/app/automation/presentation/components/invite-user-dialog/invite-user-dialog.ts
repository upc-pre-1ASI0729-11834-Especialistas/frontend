import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
  readonly dialogRef = inject(MatDialogRef<InviteUserDialog>);

  readonly inviteForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    labs: this.fb.group({
      allLabs: [false],
      lab3B: [false],
      cryoStorage: [false]
    }),
    message: ['']
  });

  ngOnInit() {
    const labsGroup = this.inviteForm.get('labs') as FormGroup;
    const allLabsControl = labsGroup.get('allLabs');
    const lab3BControl = labsGroup.get('lab3B');
    const cryoStorageControl = labsGroup.get('cryoStorage');

    // Toggle all checkboxes when All Labs is checked
    allLabsControl?.valueChanges.subscribe(checked => {
      if (checked) {
        lab3BControl?.setValue(true, { emitEvent: false });
        cryoStorageControl?.setValue(true, { emitEvent: false });
      } else if (lab3BControl?.value && cryoStorageControl?.value) {
        // Only clear if all were set (prevent clear loop if user manually unchecked one)
        lab3BControl?.setValue(false, { emitEvent: false });
        cryoStorageControl?.setValue(false, { emitEvent: false });
      }
    });

    // If individual lab is unchecked, make sure All Labs is unchecked
    lab3BControl?.valueChanges.subscribe(checked => {
      if (!checked) {
        allLabsControl?.setValue(false, { emitEvent: false });
      } else if (cryoStorageControl?.value) {
        allLabsControl?.setValue(true, { emitEvent: false });
      }
    });

    cryoStorageControl?.valueChanges.subscribe(checked => {
      if (!checked) {
        allLabsControl?.setValue(false, { emitEvent: false });
      } else if (lab3BControl?.value) {
        allLabsControl?.setValue(true, { emitEvent: false });
      }
    });
  }

  onSubmit() {
    if (this.inviteForm.valid) {
      this.dialogRef.close(this.inviteForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
