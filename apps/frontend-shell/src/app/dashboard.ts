import { Component, inject, computed, signal, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthStore, ThemeStore, ProjectsStore, Theme, ConfirmStore } from '@sas-platform/shared-core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export default class DashboardComponent implements AfterViewInit {
  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  readonly authStore = inject(AuthStore);
  readonly themeStore = inject(ThemeStore);
  readonly projectsStore = inject(ProjectsStore);
  readonly confirmStore = inject(ConfirmStore);
  readonly dashboardService = inject(DashboardService);
  private router = inject(Router);
  
  mouseX = signal(0);
  mouseY = signal(0);

  showThemeSelector = signal(false);
  showOrgSwitcher = signal(false);

  readonly currentTheme = computed(() => this.themeStore.theme());
  readonly currentOrganization = computed(() => {
    const orgId = this.authStore.currentOrganizationId();
    return this.authStore.user()?.organizations?.find(o => o.id === orgId);
  });

  readonly themes: { id: Theme; label: string; color: string }[] = [
    { id: 'midnight', label: 'Midnight', color: '#7c6fff' },
    { id: 'slate', label: 'Slate Blue', color: '#38bdf8' },
    { id: 'forest', label: 'Forest Green', color: '#10b981' },
    { id: 'void', label: 'Void Black', color: '#ffffff' },
    { id: 'nebula', label: 'Nebula Purple', color: '#a78bfa' },
  ];

  readonly pageTitle = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getCurrentPageTitle()),
      startWith(this.getCurrentPageTitle())
    )
  );

  readonly user = computed(() => this.authStore.user());
  readonly projects = computed(() => this.projectsStore.projects());
  
  readonly navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard/stats' },
    { label: 'Intelligence', icon: 'auto_awesome', route: '/dashboard/overview' },
    { label: 'Skills Lab', icon: 'terminal', route: '/dashboard/skills' },
    { label: 'Data Vault', icon: 'database', route: '/dashboard/knowledge' },
    { label: 'Observatory', icon: 'monitoring', route: '/dashboard/logs' },
    { label: 'Protocols', icon: 'tune', route: '/dashboard/settings' },
  ];

  constructor() {
    this.projectsStore.loadProjects();
  }

  ngAfterViewInit() {
    this.initCanvas();
  }

  private getCurrentPageTitle(): string {
    const url = this.router.url;
    if (url.includes('stats')) return 'DASHBOARD';
    if (url.includes('overview')) return 'INTELLIGENCE';
    if (url.includes('skills')) return 'SKILLS LAB';
    if (url.includes('knowledge')) return 'DATA VAULT';
    if (url.includes('logs')) return 'OBSERVATORY';
    if (url.includes('settings')) return 'PROTOCOLS';
    return 'DASHBOARD';
  }

  onMouseMove(event: MouseEvent) {
    this.mouseX.set(event.clientX);
    this.mouseY.set(event.clientY);
  }

  saveProject() {
    const name = this.dashboardService.projectName();
    const description = this.dashboardService.projectDescription();
    const mode = this.dashboardService.modalMode();
    const id = this.dashboardService.editingProjectId();

    if (name.trim()) {
      if (mode === 'create') {
        this.projectsStore.createProject({ name, description });
      } else if (id) {
        this.projectsStore.updateProject({ id, name, description });
      }
      this.dashboardService.closeModal();
    }
  }

  async deleteProject(id: string) {
    const confirmed = await this.confirmStore.ask({
      title: 'Decommission Unit',
      message: 'Are you sure you want to decommission this intelligence unit? This action cannot be reversed.',
      confirmLabel: 'Decommission',
      danger: true
    });

    if (confirmed) {
      this.projectsStore.deleteProject(id);
    }
  }

  onLogout() {
    this.authStore.logout();
  }

  toggleThemeSelector() {
    this.showThemeSelector.set(!this.showThemeSelector());
  }

  setTheme(theme: Theme) {
    this.themeStore.setTheme(theme);
    this.showThemeSelector.set(false);
  }

  switchOrganization(id: string) {
    this.authStore.setOrganization(id);
    this.showOrgSwitcher.set(false);
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    const particles: any[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w!,
        y: Math.random() * h!,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.2 + 0.3,
        a: Math.random(),
        color: ['#7c6fff', '#06b6d4', '#ec4899', '#22c55e'][Math.floor(Math.random() * 4)]
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.a * 0.35;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(124,111,255,0.04)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      requestAnimationFrame(draw);
    };
    draw();
  }
}
