import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectsStore, Project, ConfirmStore } from '@sas-platform/shared-core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './overview.html',
  styleUrls: ['./dashboard.scss', './overview.scss'],
})
export default class OverviewComponent implements OnInit {
  readonly projectsStore = inject(ProjectsStore);
  readonly dashboardService = inject(DashboardService);
  readonly confirmStore = inject(ConfirmStore);
  
  readonly layout = signal<'grid' | 'list' | 'details'>('grid');
  
  // Menu state
  readonly activeMenuId = signal<string | null>(null);
  
  readonly projects = computed(() => this.projectsStore.projects());

  ngOnInit() {
    // Global click listener to close menus
    window.addEventListener('click', () => this.activeMenuId.set(null));
  }

  toggleMenu(event: Event, id: string) {
    event.stopPropagation();
    this.activeMenuId.set(this.activeMenuId() === id ? null : id);
  }

  editProject(event: Event, project: Project) {
    event.stopPropagation();
    this.dashboardService.openEditProjectModal(project);
    this.activeMenuId.set(null);
  }

  async deleteProject(event: Event, id: string) {
    event.stopPropagation();
    
    const confirmed = await this.confirmStore.ask({
      title: 'Decommission Unit',
      message: 'Decommission this unit? All neural links will be severed.',
      confirmLabel: 'Decommission',
      danger: true
    });

    if (confirmed) {
      this.projectsStore.deleteProject(id);
    }
    this.activeMenuId.set(null);
  }

  trackMouse(event: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--cx', `${x}%`);
    card.style.setProperty('--cy', `${y}%`);
  }

  resetMouse(card: HTMLElement) {
    card.style.setProperty('--cx', '50%');
    card.style.setProperty('--cy', '50%');
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  isSameDate(d1: string, d2: string): boolean {
    if (!d1 || !d2) return true;
    return new Date(d1).getTime() === new Date(d2).getTime();
  }
}
