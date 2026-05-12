import { LaboratoryStore } from '../../../../../application/laboratory.store';
import { SafetyThresholds } from '../../../../../domain/model/laboratory.entity';
import { CardComponent } from '../../../../../../shared/presentation/components/card/card.component';
import { IconBadgeComponent } from '../../../../../../shared/presentation/components/icon-badge/icon-badge.component';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { model } from '@angular/core';
import { inject } from '@angular/core';
import { SectionHeaderComponent } from '../../../../../../shared/presentation/components/section-header/section-header.component';

@Component({
  selector: 'app-lab-thresholds-config',
  imports: [FormsModule, CardComponent, IconBadgeComponent, SectionHeaderComponent, MatIcon, MatFormField, MatLabel, MatSuffix, MatInput, MatSelect, MatOption],
  templateUrl: './lab-thresholds-config.component.html',
  styleUrl: './lab-thresholds-config.component.css'
})
export class LabThresholdsConfigComponent {
  protected readonly laboratoryStore = inject(LaboratoryStore);
  thresholds = model.required<SafetyThresholds>();

  get gasSensitivities(): string[] {
    return this.laboratoryStore.gasSensitivities;
  }

  get alertEscalations(): string[] {
    return this.laboratoryStore.alertEscalations;
  }
}
