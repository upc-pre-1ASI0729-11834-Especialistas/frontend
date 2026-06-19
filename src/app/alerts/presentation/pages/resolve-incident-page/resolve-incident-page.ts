import { Component, inject, signal, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertsStore } from '../../../application/alerts.store';
import { Alert } from '../../../domain/model/alert.entity';
import { TranslatePipe } from '@ngx-translate/core';

type ResolutionType = 'manual' | 'automated' | 'escalated';

@Component({
  selector: 'app-resolve-incident-page',
  standalone: true,
  imports: [MatIconModule, RouterLink, FormsModule, CommonModule, TranslatePipe],
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

  readonly alert = computed(() => {
    const id = this.alertId();
    return id ? this.alertsStore.getAlertById(id)() : undefined;
  });

  readonly location = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.labLocation || 'Building C - Level 1';
  });

  readonly currentValue = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.metrics?.find(m => m.label === 'currentValue')?.value || 'N/A';
  });

  readonly thresholdValue = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.metrics?.find(m => m.label === 'threshold')?.value || '8.0°C';
  });

  readonly exceededByValue = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.metrics?.find(m => m.label === 'exceededBy')?.value || 'N/A';
  });

  readonly affectedEquipment = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.equipmentName || 'Room Ambient';
  });

  readonly sensorId = computed(() => {
    const currentAlert = this.alert();
    return currentAlert?.sensorName || 'N/A';
  });

  readonly startedTimeAbsolute = computed(() => {
    const currentAlert = this.alert();
    if (!currentAlert || !currentAlert.createdAt) return '08:21 AM';
    return currentAlert.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  readonly startedTimeAgo = computed(() => {
    const currentAlert = this.alert();
    if (!currentAlert || !currentAlert.createdAt) return '38 minutes ago';
    const diffMs = new Date().getTime() - currentAlert.createdAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    return `${diffMins} minutes ago`;
  });

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
          status: 'RESOLVED',
          metrics: currentAlert.metrics,
          createdAt: currentAlert.createdAt,
          laboratoryId: currentAlert.laboratoryId,
          labName: currentAlert.labName,
          labLocation: currentAlert.labLocation,
          sensorId: currentAlert.sensorId,
          sensorName: currentAlert.sensorName,
          equipmentName: currentAlert.equipmentName
        });

        this.alertsStore.updateAlert(updatedAlert);
        this.router.navigate(['/alerts']);
      }
    } else {
      this.router.navigate(['/alerts']);
    }
  }
}
