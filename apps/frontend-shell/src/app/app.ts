import { Component, signal, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '@sas-platform/shared-ui';

@Component({
  imports: [RouterModule, ConfirmDialogComponent],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Global app logic
}
