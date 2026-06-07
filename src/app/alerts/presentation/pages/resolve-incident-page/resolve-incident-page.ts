import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type ResolutionType = 'manual' | 'automated' | 'escalated';

@Component({
  selector: 'app-resolve-incident-page',
  standalone: true,
  imports: [MatIconModule, RouterLink, FormsModule, CommonModule],
  templateUrl: './resolve-incident-page.html',
  styleUrl: './resolve-incident-page.css',
})
export class ResolveIncidentPage {
  resolutionNote = signal<string>('');
  resolutionType = signal<ResolutionType>('manual');
  scheduleFollowUp = signal<boolean>(false);
  uploadedFileName = signal<string | null>(null);
  uploadedFilePreview = signal<string | null>(null);
  isDraggingOver = signal<boolean>(false);

  readonly MAX_CHARS = 500;

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
    // Resolution logic — route or emit event here
    console.log({
      note: this.resolutionNote(),
      type: this.resolutionType(),
      scheduleFollowUp: this.scheduleFollowUp(),
      photo: this.uploadedFileName(),
    });
  }
}
