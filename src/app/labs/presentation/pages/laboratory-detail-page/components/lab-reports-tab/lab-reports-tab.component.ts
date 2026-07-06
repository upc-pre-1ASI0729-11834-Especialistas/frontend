import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Laboratory } from '../../../../../domain/model/laboratory.entity';

interface SafetyReport {
  id: string;
  name: string;
  type: string;
  period: string;
  size: string;
  generatedAt: string;
  status: 'READY' | 'GENERATING';
}

@Component({
  selector: 'app-lab-reports-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './lab-reports-tab.component.html',
  styleUrls: ['./lab-reports-tab.component.css']
})
export class LabReportsTabComponent {
  lab = input.required<Laboratory>();
  private readonly snackBar = inject(MatSnackBar);

  reportsList: SafetyReport[] = [
    {
      id: 'REP-01',
      name: 'Environmental Compliance Audit',
      type: 'Safety Compliance',
      period: 'May 2026',
      size: '2.4 MB',
      generatedAt: '2026-06-01T10:30:00Z',
      status: 'READY'
    },
    {
      id: 'REP-02',
      name: 'Threshold Violation Log',
      type: 'Incident Audit',
      period: 'Q2 2026',
      size: '4.1 MB',
      generatedAt: '2026-06-15T14:45:00Z',
      status: 'READY'
    },
    {
      id: 'REP-03',
      name: 'System Calibration Summary',
      type: 'Maintenance History',
      period: 'Full Year 2025',
      size: '8.7 MB',
      generatedAt: '2026-01-05T09:00:00Z',
      status: 'READY'
    },
    {
      id: 'REP-04',
      name: 'CO2 & Ventilation Performance Analysis',
      type: 'HVAC Diagnostics',
      period: 'June 2026 (Live)',
      size: '1.2 MB',
      generatedAt: '2026-06-19T08:00:00Z',
      status: 'READY'
    }
  ];

  downloadReport(report: SafetyReport) {
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
