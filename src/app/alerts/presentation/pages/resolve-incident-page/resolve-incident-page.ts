import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertsStore } from '../../../application/alerts.store';
import { Alert } from '../../../domain/model/alert.entity';

type ResolutionType = 'manual' | 'automated' | 'escalated';

@Component({
  selector: 'app-resolve-incident-page',
  standalone: true,
  imports: [MatIconModule, RouterLink, FormsModule, CommonModule],
  templateUrl: './resolve-incident-page.html',
  styleUrl: './resolve-incident-page.css',
})
export class ResolveIncidentPage {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly alertsStore = inject(AlertsStore);

  resolutionNote = signal<string>('');
  resolutionType = signal<ResolutionType>('manual');
  scheduleFollowUp = signal<boolean>(false);
  uploadedFileName = signal<string | null>(null);
  uploadedFilePreview = signal<string | null>(null);
  isDraggingOver = signal<boolean>(false);

  readonly MAX_CHARS = 500;
  readonly alertId = signal<number | null>(null);

  constructor() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.alertId.set(Number(id));
      }
    });
  }

  get noteLength(): number {
    return this.resolutionNote().length;
  }

  get canConfirm(): boolean {
    return this.resolutionNote().trim().length > 0;
  }

  setResolutionType(type: ResolutionType): void {
    this.resolutionType.set(type);
  }

  onNoteChange(value: string): void {
    if (value.length <= this.MAX_CHARS) {
      this.resolutionNote.set(value);
    }
  }

  toggleFollowUp(): void {
    this.scheduleFollowUp.set(!this.scheduleFollowUp());
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver.set(true);
  }

  onDragLeave(): void {
    this.isDraggingOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  private processFile(file: File): void {
    const allowed = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowed.includes(file.type) || file.size > maxSize) return;

    this.uploadedFileName.set(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedFilePreview.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.uploadedFileName.set(null);
    this.uploadedFilePreview.set(null);
  }

  onConfirm(): void {
    if (!this.canConfirm) return;
    
    const id = this.alertId();
    if (id) {
      const currentAlert = this.alertsStore.getAlertById(id)();
      if (currentAlert) {
        const updatedAlert = new Alert({
          id: currentAlert.id,
          title: currentAlert.title,
          description: currentAlert.description,
          severity: currentAlert.severity,
          status: 'Resolved',
          metrics: currentAlert.metrics
        });

        this.alertsStore.updateAlert(updatedAlert);
        this.router.navigate(['/alerts']);
      }
    } else {
      // Fallback if no specific alert is targeted
      this.router.navigate(['/alerts']);
    }
  }
}
