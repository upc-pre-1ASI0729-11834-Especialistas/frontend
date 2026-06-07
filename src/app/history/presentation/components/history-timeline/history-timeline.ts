import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { HistoryRecord } from '../../../domain/model/history-record.entity';

interface HistoryGroup {
  label: string;
  records: HistoryRecord[];
}

@Component({
  selector: 'app-history-timeline',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './history-timeline.html',
  styleUrl: './history-timeline.css'
})
export class HistoryTimeline {
  private readonly recordsSignal = signal<HistoryRecord[]>([]);

  @Input({ required: true })
  set records(value: HistoryRecord[]) {
    this.recordsSignal.set(value ?? []);
  }

  @Output() recordSelected = new EventEmitter<HistoryRecord>();

  readonly grouped = computed<HistoryGroup[]>(() => {
    const groups = new Map<string, HistoryRecord[]>();

    for (const record of this.recordsSignal()) {
      const label = this.toDateLabel(record.occurredAt);
      const group = groups.get(label);
      if (group) {
        group.push(record);
      } else {
        groups.set(label, [record]);
      }
    }

    return Array.from(groups.entries()).map(([label, records]) => ({
      label,
      records: records.sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))
    }));
  });

  select(record: HistoryRecord): void {
    this.recordSelected.emit(record);
  }

  private toDateLabel(occurredAt: string): string {
    const date = new Date(occurredAt);
    if (Number.isNaN(date.getTime())) {
      return 'Unknown date';
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  }
}

