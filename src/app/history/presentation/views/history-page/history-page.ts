import { Component, ViewChild, computed, signal, inject } from '@angular/core';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

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
    HistoryTimeline
  ],
  templateUrl: './history-page.html',
  styleUrl: './history-page.css'
})
export class HistoryPage {
  @ViewChild('drawer') drawer!: MatDrawer;

  private readonly historyStore = inject(HistoryStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly history = this.historyStore.history;
  readonly loading = this.historyStore.loading;
  readonly error = this.historyStore.error;

  readonly selectedTab = signal<string>('All events');
  readonly shiftNotes = signal<string>('');
  readonly handoverNote = signal<string>('');

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
  }

  openDrawer(record: HistoryRecord): void {
    this.selectedRecord = record;
    this.drawer.open();
  }

  openPlaceholder(actionLabel: string): void {
    if (actionLabel.toLowerCase().includes('report') || actionLabel.toLowerCase().includes('pdf')) {
      this.snackBar.open(`Generating PDF: ${actionLabel}...`, 'Close', { duration: 3000 });
      return;
    }
    this.dialog.open(HistoryPlaceholderDialog, {
      data: {
        title: actionLabel,
        message: 'This action will be available in a future release.'
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
