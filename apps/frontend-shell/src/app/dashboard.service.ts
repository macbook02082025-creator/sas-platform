import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  showProjectModal = signal(false);
  newProjectName = signal('');

  openNewProjectModal() {
    this.newProjectName.set('');
    this.showProjectModal.set(true);
  }

  closeModal() {
    this.showProjectModal.set(false);
  }
}
