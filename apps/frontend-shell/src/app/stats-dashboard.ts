import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsStore, ActivityStore, SkillsStore, ProjectsStore } from '@sas-platform/shared-core';

@Component({
  selector: 'app-stats-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-dashboard.html',
  styleUrls: ['./dashboard.scss', './overview.scss'],
})
export default class StatsDashboardComponent implements OnInit {
  readonly statsStore = inject(StatsStore);
  readonly activityStore = inject(ActivityStore);
  readonly skillsStore = inject(SkillsStore);
  readonly projectsStore = inject(ProjectsStore);
  
  readonly stats = computed(() => this.statsStore.stats());
  readonly activities = computed(() => this.activityStore.activities());
  readonly barWidths = signal<{ [key: string]: string }>({});

  readonly layout = signal<'grid' | 'list'>('list');
  readonly activeMenuId = signal<string | null>(null);

  readonly selectedRange = signal('this_week');
  readonly availableRanges = [
    { label: 'Today', id: 'today' },
    { label: 'Yesterday', id: 'yesterday' },
    { label: 'This Week', id: 'this_week' },
    { label: 'This Month', id: 'this_month' },
    { label: 'This Quarter', id: 'this_quarter' },
    { label: 'This Year', id: 'this_year' },
  ];

  // DYNAMIC SKILLS FROM DB
  readonly recentSkills = computed(() => {
    return [...this.skillsStore.skills()]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5)
      .map(s => ({
        ...s,
        calls: Math.floor(Math.random() * 1000) + ' calls',
        score: Math.floor(Math.random() * 15) + 85,
        icon: this.getSkillIcon(s.name)
      }));
  });

  // MOCK CHART DATA
  readonly chartData = signal([
    { day: 'Mon', grounded: 82, review: 12, flagged: 6 },
    { day: 'Tue', grounded: 88, review: 8, flagged: 4 },
    { day: 'Wed', grounded: 75, review: 15, flagged: 10 },
    { day: 'Thu', grounded: 92, review: 5, flagged: 3 },
    { day: 'Fri', grounded: 85, review: 10, flagged: 5 },
    { day: 'Sat', grounded: 95, review: 3, flagged: 2 },
    { day: 'Sun', grounded: 90, review: 7, flagged: 3 },
  ]);

  ngOnInit() {
    this.refreshData();
    
    // Trigger bar animations
    setTimeout(() => {
      this.barWidths.set({
        active: '75%',
        skills: '62%',
        vaults: '88%',
        uptime: '99%'
      });
    }, 400);

    window.addEventListener('click', () => this.activeMenuId.set(null));
  }

  setRange(rangeId: string) {
    this.selectedRange.set(rangeId);
    this.refreshData();
  }

  private refreshData() {
    const range = this.selectedRange();
    this.statsStore.loadStats({ range });
    this.activityStore.loadActivities({ range });
    this.skillsStore.loadSkills(); // Skills don't necessarily need range filtering unless requested
    this.projectsStore.loadProjects();
  }

  getSkillIcon(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('code')) return 'terminal';
    if (n.includes('chat') || n.includes('faq')) return 'chat';
    if (n.includes('mail')) return 'mail';
    if (n.includes('legal')) return 'gavel';
    if (n.includes('med')) return 'medical_services';
    return 'psychology';
  }

  getQualityColor(score: number): string {
    if (score > 90) return '#22c55e';
    if (score > 75) return '#f59e0b';
    return '#ef4444';
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

  formatTime(dateString: string | Date | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString.toString();
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}
