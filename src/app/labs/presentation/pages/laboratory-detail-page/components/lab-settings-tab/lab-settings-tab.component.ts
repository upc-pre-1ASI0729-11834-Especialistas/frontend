import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Laboratory } from '../../../../../domain/model/laboratory.entity';
import { LaboratoryStore } from '../../../../../application/laboratory.store';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lab-settings-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    TranslatePipe
  ],
  templateUrl: './lab-settings-tab.component.html',
  styleUrls: ['./lab-settings-tab.component.css']
})
export class LabSettingsTabComponent {
  lab = input.required<Laboratory>();
  private readonly laboratoryStore = inject(LaboratoryStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);

  isSaving = false;

  onDelete() {
    const confirmMessage = this.translateService.instant(
      'laboratoriesDetail.tabSettings.dangerZone.confirmDelete',
      { name: this.lab().name }
    );
    const confirmation = confirm(confirmMessage);
    if (confirmation) {
      this.isSaving = true;
      this.laboratoryStore.deleteLaboratory(this.lab().id, () => {
        this.isSaving = false;
        this.snackBar.open('Laboratory deleted successfully.', 'Dismiss', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/laboratories']);
      });
    }
  }
}
