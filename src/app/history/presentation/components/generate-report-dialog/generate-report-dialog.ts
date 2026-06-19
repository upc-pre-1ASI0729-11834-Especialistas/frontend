import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HistoryRecord } from '../../../domain/model/history-record.entity';

interface GenerateReportDialogData {
  shiftNotes: string;
  handoverNote: string;
  criticalEvents: number;
  activeEvents: number;
  resolvedEvents: number;
  totalEvents: number;
  filteredHistory: HistoryRecord[];
  loggedInProfile: any;
}

@Component({
  selector: 'app-generate-report-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './generate-report-dialog.html',
  styleUrl: './generate-report-dialog.css'
})
export class GenerateReportDialog implements OnInit {
  private readonly translateService = inject(TranslateService);
  shiftNotes = '';
  handoverNote = '';

  constructor(
    readonly dialogRef: MatDialogRef<GenerateReportDialog>,
    @Inject(MAT_DIALOG_DATA) readonly data: GenerateReportDialogData
  ) {
    this.shiftNotes = data.shiftNotes;
    this.handoverNote = data.handoverNote;
  }

  ngOnInit(): void {}

  get totalEvents(): number {
    return this.data.filteredHistory.length;
  }

  get incidentsCount(): number {
    return this.data.filteredHistory.filter(
      r => r.severity === 'Critical' || r.severity === 'Warning' || r.eventType?.toLowerCase() === 'incident'
    ).length;
  }

  get resolvedCount(): number {
    return this.data.filteredHistory.filter(r => r.status === 'Resolved').length;
  }

  get activeCount(): number {
    return this.data.filteredHistory.filter(r => r.status === 'Active').length;
  }

  get manualCount(): number {
    return this.data.filteredHistory.filter(
      r => r.eventType?.toLowerCase() === 'observation' || r.eventType?.toLowerCase() === 'manual'
    ).length;
  }

  get automationsCount(): number {
    return this.data.filteredHistory.filter(r => r.eventType?.toLowerCase() === 'automation').length;
  }

  onCancel(): void {
    this.dialogRef.close({
      shiftNotes: this.shiftNotes,
      handoverNote: this.handoverNote
    });
  }

  onPreview(): void {
    this.generateShiftReport();
  }

  onDownload(): void {
    this.generateShiftReport();
  }

  private generateShiftReport(): void {
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      return;
    }

    const name = this.data.loggedInProfile?.fullName || 'Manuel Sánchez';
    const startStr = this.data.loggedInProfile?.defaultStartShift || '08:00 AM';
    const durationStr = this.data.loggedInProfile?.shiftDuration || '8 Hours';

    const match = startStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    let hours = 8;
    let minutes = 0;
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }
    const durationHours = parseInt(durationStr, 10) || 8;
    const endHours = (hours + durationHours) % 24;
    const endAmPm = endHours >= 12 ? 'PM' : 'AM';
    const displayEndHours = endHours % 12 === 0 ? 12 : endHours % 12;
    const endStr = `${displayEndHours}:${minutes.toString().padStart(2, '0')} ${endAmPm}`;
    const shiftRange = `${startStr} – ${endStr}`;

    const currentDate = new Date().toLocaleString();

    const t = (key: string, params?: any) => this.translateService.instant(key, params);

    const titleTrans = t('history.pdf.title');
    const activeShiftTrans = t('history.pdf.activeShift');
    const reportDateTrans = t('history.pdf.reportDate');
    const systemStatusTrans = t('history.pdf.systemStatus');
    const operationalTrans = t('history.pdf.operational');
    const totalEventsTrans = t('history.pdf.totalEvents');
    const incidentsTrans = t('history.pdf.incidents');
    const resolvedTrans = t('history.pdf.resolved');
    const activeTrans = t('history.pdf.active');
    const manualObservationsTrans = t('history.pdf.manualObservations');
    const automationsTrans = t('history.pdf.automations');
    const generalNotesTrans = t('history.pdf.generalNotes');
    const handoverNoteTrans = t('history.pdf.handoverNote');
    const noNotesTrans = t('history.pdf.noNotes');
    const noHandoverTrans = t('history.pdf.noHandover');
    const timelineEventsTrans = t('history.pdf.timelineEvents');
    const timeTrans = t('history.pdf.time');
    const laboratoryTrans = t('history.pdf.laboratory');
    const severityTrans = t('history.pdf.severity');
    const eventNameTrans = t('history.pdf.eventName');
    const descriptionTrans = t('history.pdf.description');
    const statusTrans = t('history.pdf.status');
    const noEventsTrans = t('history.pdf.noEvents');
    const operatorSignatureTrans = t('history.pdf.operatorSignature', { name });
    const coordinatorSignatureTrans = t('history.pdf.coordinatorSignature');

    let statsItemsHTML = `
      <div class="stat-item">
        <strong>${this.totalEvents}</strong>
        ${totalEventsTrans}
      </div>
    `;
    let countActiveStats = 1;

    if (this.incidentsCount > 0) {
      statsItemsHTML += `
        <div class="stat-item">
          <strong>${this.incidentsCount}</strong>
          ${incidentsTrans}
        </div>
      `;
      countActiveStats++;
    }
    if (this.resolvedCount > 0) {
      statsItemsHTML += `
        <div class="stat-item">
          <strong>${this.resolvedCount}</strong>
          ${resolvedTrans}
        </div>
      `;
      countActiveStats++;
    }
    if (this.activeCount > 0) {
      statsItemsHTML += `
        <div class="stat-item">
          <strong>${this.activeCount}</strong>
          ${activeTrans}
        </div>
      `;
      countActiveStats++;
    }
    if (this.manualCount > 0) {
      statsItemsHTML += `
        <div class="stat-item">
          <strong>${this.manualCount}</strong>
          ${manualObservationsTrans}
        </div>
      `;
      countActiveStats++;
    }
    if (this.automationsCount > 0) {
      statsItemsHTML += `
        <div class="stat-item">
          <strong>${this.automationsCount}</strong>
          ${automationsTrans}
        </div>
      `;
      countActiveStats++;
    }

    const statsHTML = `
      <div class="stats-box" style="grid-template-columns: repeat(${countActiveStats}, 1fr)">
        ${statsItemsHTML}
      </div>
    `;

    const notesHTML = `
      <div class="notes-section">
        <h3>${generalNotesTrans}</h3>
        <p>${this.shiftNotes.replace(/\n/g, '<br>') || `<em>${noNotesTrans}</em>`}</p>
      </div>
      <div class="notes-section" style="border-left-color: #f59e0b;">
        <h3>${handoverNoteTrans}</h3>
        <p>${this.handoverNote.replace(/\n/g, '<br>') || `<em>${noHandoverTrans}</em>`}</p>
      </div>
    `;

    const eventsRows = this.data.filteredHistory.map(record => {
      const severityLower = record.severity.toLowerCase();
      const severityKey = `dashboard.severity.${severityLower}`;
      const translatedSeverity = t(severityKey) !== severityKey ? t(severityKey) : record.severity;

      const statusLower = record.status.toLowerCase();
      const statusKey = `common.status.${statusLower}`;
      const translatedStatus = t(statusKey) !== statusKey ? t(statusKey) : record.status;

      return `
        <tr>
          <td>${new Date(record.occurredAt).toLocaleTimeString()}</td>
          <td>${record.lab}</td>
          <td><span class="badge ${severityLower}">${translatedSeverity}</span></td>
          <td>${record.name}</td>
          <td>${record.description}</td>
          <td>${translatedStatus}</td>
        </tr>
      `;
    }).join('');

    const timelineHTML = `
      <h3>${timelineEventsTrans}</h3>
      <table class="report-table">
        <thead>
          <tr>
            <th>${timeTrans}</th>
            <th>${laboratoryTrans}</th>
            <th>${severityTrans}</th>
            <th>${eventNameTrans}</th>
            <th>${descriptionTrans}</th>
            <th>${statusTrans}</th>
          </tr>
        </thead>
        <tbody>
          ${eventsRows || `<tr><td colspan="6" style="text-align: center;">${noEventsTrans}</td></tr>`}
        </tbody>
      </table>
    `;

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${titleTrans} - ${new Date().toLocaleDateString()}</title>
        <style>
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #1e293b;
            padding: 40px;
            background: #ffffff;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            font-size: 24px;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
          }
          .header-meta {
            text-align: right;
            font-size: 14px;
            color: #64748b;
          }
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #0f172a;
            margin-top: 30px;
            margin-bottom: 10px;
          }
          .stats-box {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }
          .stat-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            font-size: 14px;
          }
          .stat-item strong {
            display: block;
            font-size: 20px;
            color: #0f172a;
            margin-bottom: 5px;
          }
          .notes-section {
            background: #f8fafc;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 0 8px 8px 0;
          }
          .notes-section h3 {
            font-size: 16px;
            margin: 0 0 10px 0;
            color: #1e293b;
          }
          .report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            margin-bottom: 40px;
          }
          .report-table th, .report-table td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
          }
          .report-table th {
            background: #f1f5f9;
            color: #475569;
            font-weight: 600;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            font-size: 11px;
            font-weight: 500;
            border-radius: 4px;
            text-transform: uppercase;
          }
          .badge.critical { background: #fee2e2; color: #991b1b; }
          .badge.warning { background: #ffedd5; color: #9a3412; }
          .badge.info { background: #dbeafe; color: #1e40af; }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            border-top: 1px dashed #cbd5e1;
            padding-top: 40px;
          }
          .sig-line {
            width: 45%;
            text-align: center;
            font-size: 14px;
            color: #64748b;
          }
          .sig-line div {
            border-top: 1px solid #94a3b8;
            margin-top: 40px;
            padding-top: 8px;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>${titleTrans}</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #475569;">${activeShiftTrans}: ${shiftRange} · ${name}</p>
          </div>
          <div class="header-meta">
            <p style="margin: 0;"><strong>${reportDateTrans}:</strong> ${currentDate}</p>
            <p style="margin: 5px 0 0 0;"><strong>${systemStatusTrans}:</strong> ${operationalTrans}</p>
          </div>
        </div>

        ${statsHTML}
        ${notesHTML}
        ${timelineHTML}

        <div class="signatures">
          <div class="sig-line">
            <div>${operatorSignatureTrans}</div>
          </div>
          <div class="sig-line">
            <div>${coordinatorSignatureTrans}</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    reportWindow.document.close();
  }
}
