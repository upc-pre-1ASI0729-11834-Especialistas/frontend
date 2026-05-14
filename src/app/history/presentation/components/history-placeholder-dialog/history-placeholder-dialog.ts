import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface PlaceholderDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-history-placeholder-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './history-placeholder-dialog.html'
})
export class HistoryPlaceholderDialog {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: PlaceholderDialogData) {}
}

