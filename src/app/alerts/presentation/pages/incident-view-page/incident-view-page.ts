import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { EscalateSupervisorDialog } from '../escalate-dialog/escalate-supervisor-dialog';

@Component({
  selector: 'app-incident-view-page',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatDialogModule],
  templateUrl: './incident-view-page.html',
  styleUrl: './incident-view-page.css',
})
export class IncidentViewPage {
  private readonly dialog = inject(MatDialog);

  openEscalate(): void {
    this.dialog.open(EscalateSupervisorDialog, {
      data: {
        equipmentName: 'Refrigerator B-02',
        incidentDescription: 'Temperature Critical'
      }
    });
  }
}
