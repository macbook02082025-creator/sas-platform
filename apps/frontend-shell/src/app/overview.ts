import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsStore, ActivityStore, StatsStore } from '@sas-platform/shared-core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrls: ['./dashboard.scss', './overview.scss'],
})
export default class OverviewComponent implements OnInit {
  readonly projectsStore = inject(ProjectsStore);
  readonly activityStore = inject(ActivityStore);
  readonly statsStore = inject(StatsStore);
  readonly dashboardService = inject(DashboardService);
  
  readonly layout = signal<'grid' | 'list'>('grid');
  readonly barWidths = signal<{ [key: string]: string }>({});
  
  readonly projects = computed(() => this.projectsStore.projects());
  readonly activities = computed(() => this.activityStore.activities());
  readonly stats = computed(() => this.statsStore.stats());

  ngOnInit() {
    this.activityStore.loadActivities();
    this.statsStore.loadStats();
    
    // Trigger bar animations
    setTimeout(() => {
      this.barWidths.set({
        active: '75%',
        skills: '62%',
        vaults: '88%',
        uptime: '99%'
      });
    }, 400);
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
