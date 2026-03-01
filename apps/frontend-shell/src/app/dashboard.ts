import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthStore, ThemeStore, ProjectsStore } from '@sas-platform/shared-core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export default class DashboardComponent {
  readonly authStore = inject(AuthStore);
  readonly themeStore = inject(ThemeStore);
  readonly projectsStore = inject(ProjectsStore);
  
  // Spotlight and Mouse Tracking
  mouseX = signal(0);
  mouseY = signal(0);

  // Modal state
  showProjectModal = signal(false);
  newProjectName = signal('');

  // Computed signals
  readonly user = computed(() => this.authStore.user());
  readonly organization = computed(() => this.user()?.organization);
  readonly projects = computed(() => this.projectsStore.projects());
  
  readonly navItems = [
    { label: 'Intelligence', icon: 'auto_awesome', route: '/dashboard' },
    { label: 'Skills Lab', icon: 'terminal', route: '/dashboard/skills' },
    { label: 'Data Vault', icon: 'database', route: '/dashboard/knowledge' },
    { label: 'Observatory', icon: 'monitoring', route: '/dashboard/logs' },
    { label: 'Protocols', icon: 'tune', route: '/dashboard/settings' },
  ];

  constructor() {
    this.projectsStore.loadProjects();
  }

  onMouseMove(event: MouseEvent) {
    this.mouseX.set(event.clientX);
    this.mouseY.set(event.clientY);
  }

  openNewProjectModal() {
    this.newProjectName.set('');
    this.showProjectModal.set(true);
  }

  closeModal() {
    this.showProjectModal.set(false);
  }

  createProject() {
    if (this.newProjectName().trim()) {
      this.projectsStore.createProject({ name: this.newProjectName() });
      this.closeModal();
    }
  }

  onLogout() {
    this.authStore.logout();
  }
}
