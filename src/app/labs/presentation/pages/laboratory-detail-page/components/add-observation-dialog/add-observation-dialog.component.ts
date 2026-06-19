import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-observation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './add-observation-dialog.component.html',
  styleUrl: './add-observation-dialog.component.css'
})
export class AddObservationDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<AddObservationDialogComponent>);
  readonly data = inject<{ labName: string }>(MAT_DIALOG_DATA);

  readonly observationForm: FormGroup = this.fb.group({
    text: ['', [Validators.required, Validators.minLength(1)]],
    type: ['Laboratory log', Validators.required]
  });

  logTypes = ['Laboratory log', 'Maintenance log', 'Incident log'];

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.observationForm.valid) {
      this.dialogRef.close(this.observationForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
