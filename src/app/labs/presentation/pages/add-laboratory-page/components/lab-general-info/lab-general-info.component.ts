import { LaboratoryStore, LaboratoryFormData } from '../../../../../application/laboratory.store';
import { CardComponent } from '../../../../../../shared/presentation/components/card/card.component';
import { SectionHeaderComponent } from '../../../../../../shared/presentation/components/section-header/section-header.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Component, model, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-lab-general-info',
  imports: [
    FormsModule,
    CardComponent,
    SectionHeaderComponent,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule
  ],
  templateUrl: './lab-general-info.component.html',
  styleUrls: ['./lab-general-info.component.css']
})
export class LabGeneralInfoComponent {
  protected readonly laboratoryStore = inject(LaboratoryStore);
  formData = model.required<LaboratoryFormData>();

  get buildings(): string[] {
    return this.laboratoryStore.buildings;
  }

  get floors(): string[] {
    return this.laboratoryStore.floors;
  }

  get labTypes(): string[] {
    return this.laboratoryStore.labTypes;
  }
}
