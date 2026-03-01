import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmStore } from '@sas-platform/shared-core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.css'],
})
export class ConfirmDialogComponent {
  readonly confirmStore = inject(ConfirmStore);
}
