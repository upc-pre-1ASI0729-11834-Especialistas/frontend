import { Component, ViewChild, computed, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HistoryStore } from '../../../application/history.store';
import { HistoryRecord } from '../../../domain/model/history-record.entity';
import { HistoryTimeline } from '../../components/history-timeline/history-timeline';
import { HistoryPlaceholderDialog } from '../../components/history-placeholder-dialog/history-placeholder-dialog';
import { GenerateReportDialog } from '../../components/generate-report-dialog/generate-report-dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthStore } from '../../../../iam/application/auth.store';
import { AutomationStore } from '../../../../automation/application/automation.store';
import { TopbarActionService } from '../../../../shared/application/topbar-action.service';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    HistoryTimeline,
    TranslatePipe
  ],
  templateUrl: './history-page.html',
  styleUrls: ['./history-page.css']
})
export class HistoryPage {
  @ViewChild('drawer') drawer!: MatDrawer;

  private readonly historyStore = inject(HistoryStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authStore = inject(AuthStore);
  private readonly automationStore = inject(AutomationStore);
  private readonly topbarActionService = inject(TopbarActionService);
  private readonly translateService = inject(TranslateService);

  readonly history = this.historyStore.history;
  readonly loading = this.historyStore.loading;
  readonly error = this.historyStore.error;

  private readonly currentLang = signal(this.translateService.currentLang || 'en');

  readonly loggedInProfile = computed(() => {
    const email = this.authStore.currentUser()?.email;
    return this.automationStore.userProfiles().find(p => p.email === email);
  });

  readonly shiftInfoText = computed(() => {
    this.currentLang();

    const profile = this.loggedInProfile();
    const name = profile?.fullName || 'Manuel Sánchez';
    const startStr = profile?.defaultStartShift || '08:00 AM';
    const durationStr = profile?.shiftDuration || '8 Hours';

    // Parse start time (e.g. "08:00 AM")
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

    const todayStart = new Date();
    todayStart.setHours(hours, minutes, 0, 0);

    const now = new Date();
    let diffMs = now.getTime() - todayStart.getTime();
    if (diffMs < 0) {
      todayStart.setDate(todayStart.getDate() - 1);
      diffMs = now.getTime() - todayStart.getTime();
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    const durationHours = parseInt(durationStr, 10) || 8;
    const endHours = (hours + durationHours) % 24;
    const endAmPm = endHours >= 12 ? 'PM' : 'AM';
    const displayEndHours = endHours % 12 === 0 ? 12 : endHours % 12;
    const endStr = `${displayEndHours}:${minutes.toString().padStart(2, '0')} ${endAmPm}`;

    const currentShiftTrans = this.translateService.instant('history.shift.current');
    const activeTrans = this.translateService.instant('history.shift.active');
    return `${currentShiftTrans}: ${startStr} – ${endStr} · ${name} · ${diffHours}h ${diffMins}m ${activeTrans}`;
  });

  readonly selectedTab = signal<string>('All events');
  shiftNotes = '';
  handoverNote = '';

  readonly searchQuery = signal('');
  readonly selectedLab = signal('');
  readonly selectedEventType = signal('');
  readonly selectedSeverity = signal('');

  readonly dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  private readonly dateRangeValue = signal<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });

  selectedRecord: HistoryRecord | null = null;

  readonly labs = computed(() => this.buildOptions(this.history().map(item => item.lab)));
  readonly eventTypes = computed(() => this.buildOptions(this.history().map(item => item.eventType)));
  readonly severities = computed(() => this.buildOptions(this.history().map(item => item.severity)));

  readonly filteredHistory = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const lab = this.selectedLab();
    const eventType = this.selectedEventType();
    const severity = this.selectedSeverity();
    const { start, end } = this.dateRangeValue();
    const tab = this.selectedTab().toLowerCase();

    return this.history().filter(record => {
      // Filter by top tabs
      if (tab !== 'all events') {
        if (tab === 'incidents' && record.severity !== 'Critical' && record.severity !== 'Warning') {
          return false;
        }
        if (tab === 'resolutions' && record.status !== 'Resolved') {
          return false;
        }
        if (tab === 'manual observations' && record.eventType?.toLowerCase() !== 'observation' && record.eventType?.toLowerCase() !== 'manual') {
          return false;
        }
        if (tab === 'automations' && record.eventType?.toLowerCase() !== 'automation') {
          return false;
        }
      }

      if (query && !record.name.toLowerCase().includes(query)) {
        return false;
      }
      if (lab && record.lab !== lab) {
        return false;
      }
      if (eventType && record.eventType !== eventType) {
        return false;
      }
      if (severity && record.severity !== severity) {
        return false;
      }
      if (!this.inRangeUtc(record.occurredAt, start, end)) {
        return false;
      }
      return true;
    });
  });

  readonly totalEvents = computed(() => this.history().length);
  readonly resolvedEvents = computed(() => this.history().filter(item => item.status === 'Resolved').length);
  readonly criticalEvents = computed(() => this.history().filter(item => item.severity === 'Critical').length);
  readonly activeEvents = computed(() => this.history().filter(item => item.status === 'Active').length);

  constructor() {
    this.dateRange.valueChanges
      .pipe(startWith(this.dateRange.getRawValue()), takeUntilDestroyed())
      .subscribe(value => {
        this.dateRangeValue.set({
          start: value?.start ?? null,
          end: value?.end ?? null
        });
      });

    effect(() => {
      const text = this.shiftInfoText();
      this.topbarActionService.setSubtitle(text);
    });

    // Set initial title and action using current translation
    this.topbarActionService.setTitle(this.translateService.instant('history.title'));
    this.topbarActionService.setAction({
      label: this.translateService.instant('history.button.generateReport'),
      icon: 'picture_as_pdf',
      id: 'generate-report-action'
    });

    // Listen to translation changes to update topbar title and action
    this.translateService.onLangChange.pipe(takeUntilDestroyed()).subscribe(event => {
      this.currentLang.set(event.lang);
      this.topbarActionService.setTitle(this.translateService.instant('history.title'));
      this.topbarActionService.setAction({
        label: this.translateService.instant('history.button.generateReport'),
        icon: 'picture_as_pdf',
        id: 'generate-report-action'
      });
    });

    // Subscribe to Topbar action click
    this.topbarActionService.actionClicked$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.generateShiftReport();
      });
  }

  openDrawer(record: HistoryRecord): void {
    this.selectedRecord = record;
    this.drawer.open();
  }

  openPlaceholder(actionLabel: string): void {
    if (actionLabel.toLowerCase().includes('report') || actionLabel.toLowerCase().includes('pdf')) {
      this.generateShiftReport();
      return;
    }
    this.dialog.open(HistoryPlaceholderDialog, {
      data: {
        title: actionLabel,
        message: 'This action will be available in a future release.'
      }
    });
  }

  generateShiftReport(): void {
    const dialogRef = this.dialog.open(GenerateReportDialog, {
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '400px',
      panelClass: 'side-sheet-dialog',
      data: {
        shiftNotes: this.shiftNotes,
        handoverNote: this.handoverNote,
        criticalEvents: this.criticalEvents(),
        activeEvents: this.activeEvents(),
        resolvedEvents: this.resolvedEvents(),
        totalEvents: this.totalEvents(),
        filteredHistory: this.filteredHistory(),
        loggedInProfile: this.loggedInProfile()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shiftNotes = result.shiftNotes;
        this.handoverNote = result.handoverNote;
      }
    });
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedLab.set('');
    this.selectedEventType.set('');
    this.selectedSeverity.set('');
    this.dateRange.reset();
  }

  private buildOptions(values: string[]): string[] {
    return Array.from(new Set(values)).sort();
  }

  private inRangeUtc(occurredAt: string, start: Date | null, end: Date | null): boolean {
    if (!start && !end) {
      return true;
    }
    const recordTime = Date.parse(occurredAt);
    if (Number.isNaN(recordTime)) {
      return false;
    }
    const startTime = start ? Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()) : null;
    const endTime = end
      ? Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999)
      : null;

    if (startTime !== null && recordTime < startTime) {
      return false;
    }
    if (endTime !== null && recordTime > endTime) {
      return false;
    }
    return true;
  }
}
