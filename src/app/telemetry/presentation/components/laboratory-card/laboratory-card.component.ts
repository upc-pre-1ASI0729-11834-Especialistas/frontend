import { Component, input, computed } from '@angular/core';
import { Laboratory } from '../../../domain/model/laboratory.entity';
import { StatusBadgeComponent } from '../../../../shared/presentation/components/status-badge/status-badge.component';
import { CardComponent } from '../../../../shared/presentation/components/card/card.component';

@Component({
  selector: 'app-laboratory-card',
  imports: [StatusBadgeComponent, CardComponent],
  templateUrl: './laboratory-card.component.html',
  styleUrls: ['./laboratory-card.component.css'],
})
export class LaboratoryCardComponent {
  lab = input.required<Laboratory>();

  borderColor = computed(() => {
    const lab = this.lab();
    if (lab.isAlert()) return 'var(--mat-sys-error-container)';
    if (lab.isWarning()) return 'var(--warning-color)';
    return '';
  });
}
