import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsStore } from '@sas-platform/shared-core';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrls: ['../dashboard.scss', './overview.scss'],
})
export default class OverviewComponent {
  readonly projectsStore = inject(ProjectsStore);
  readonly projects = computed(() => this.projectsStore.projects());
}
