import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Laboratory } from '../../../../../domain/model/laboratory.entity';
import { ComplianceReportApi } from '../../../../../infrastructure/compliance-report-api';
import { ComplianceReport } from '../../../../../domain/model/compliance-report.entity';

@Component({
  selector: 'app-lab-reports-tab',
  standalone: true,
  imports: [CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule, TranslatePipe,],
  templateUrl: './lab-reports-tab.component.html',
  styleUrls: ['./lab-reports-tab.component.css']
})
export class LabReportsTabComponent {
  lab = input.required<Laboratory>();
  private readonly snackBar = inject(MatSnackBar);
  private readonly complianceReportApi = inject(ComplianceReportApi);

  reportsList = signal<ComplianceReport[]>([]);

  constructor() {
    effect(() => {
      const labId = this.lab().id;
      if (labId) {
        this.complianceReportApi.getReportsByLabId(labId).subscribe({
          next: (reports) => {
            this.reportsList.set(reports);
          },
          error: (err) => {
            console.error('Error fetching compliance reports', err);
            this.reportsList.set([]);
          }
        });
      }
    });
  }

  downloadReport(report: ComplianceReport) {
    this.snackBar.open(`Downloading "${report.name} (${report.period}).pdf"...`, 'Dismiss', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }

  getFormattedDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
