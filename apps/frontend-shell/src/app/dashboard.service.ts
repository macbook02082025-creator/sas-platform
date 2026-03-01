import { Injectable, signal } from '@angular/core';
import { Project } from '@sas-platform/shared-core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  showProjectModal = signal(false);
  modalMode = signal<'create' | 'edit'>('create');
  editingProjectId = signal<string | null>(null);
  
  projectName = signal('');
  projectDescription = signal('');

  openNewProjectModal() {
    this.modalMode.set('create');
    this.projectName.set('');
    this.projectDescription.set('');
    this.showProjectModal.set(true);
  }

  openEditProjectModal(project: Project) {
    this.modalMode.set('edit');
    this.editingProjectId.set(project.id);
    this.projectName.set(project.name);
    this.projectDescription.set(project.description || '');
    this.showProjectModal.set(true);
  }

  closeModal() {
    this.showProjectModal.set(false);
    this.editingProjectId.set(null);
  }
}
