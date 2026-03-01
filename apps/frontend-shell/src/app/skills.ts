import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SkillsStore, ProjectsStore } from '@sas-platform/shared-core';

@Component({
  selector: 'app-skill-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skills.html',
  styleUrls: ['./dashboard.scss', './skills.scss'],
})
export class SkillEditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  readonly skillsStore = inject(SkillsStore);
  readonly projectsStore = inject(ProjectsStore);

  showEditor = signal(false);
  
  readonly skills = computed(() => this.skillsStore.skills());
  readonly projects = computed(() => this.projectsStore.projects());

  skillForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    systemPrompt: ['', [Validators.required]],
    modelName: ['gpt-4o'],
    temperature: [0.7, [Validators.min(0), Validators.max(2)]],
    projectId: ['', [Validators.required]]
  });

  ngOnInit() {
    if (this.projects().length > 0) {
      this.skillsStore.loadSkills({ projectId: this.projects()[0].id });
      this.skillForm.patchValue({ projectId: this.projects()[0].id });
    }
  }

  openEditor() {
    this.showEditor.set(true);
  }

  closeEditor() {
    this.showEditor.set(false);
    this.skillForm.reset({
      modelName: 'gpt-4o',
      temperature: 0.7
    });
  }

  onSubmit() {
    if (this.skillForm.valid) {
      this.skillsStore.createSkill(this.skillForm.value as any);
      this.closeEditor();
    }
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
}
