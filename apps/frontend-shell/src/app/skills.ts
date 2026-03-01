import { Component, inject, computed, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SkillsStore, ProjectsStore, Skill, ConfirmStore } from '@sas-platform/shared-core';

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
  readonly confirmStore = inject(ConfirmStore);

  selectedProjectId = signal<string | null>(null);

  showEditor = signal(false);
  modalMode = signal<'create' | 'edit'>('create');
  editingSkillId = signal<string | null>(null);
  
  // Sandbox state
  testInput = signal('');
  testResponse = signal('');
  isTesting = signal(false);
  
  readonly layout = signal<'grid' | 'list' | 'details'>('grid');
  
  readonly skills = computed(() => this.skillsStore.skills());
  readonly projects = computed(() => this.projectsStore.projects());

  // Menu state
  readonly activeMenuId = signal<string | null>(null);

  skillForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    systemPrompt: ['', [Validators.required]],
    modelName: ['gpt-4o'],
    temperature: [0.7, [Validators.min(0), Validators.max(2)]],
    projectId: ['', [Validators.required]]
  });

  constructor() {
    effect(() => {
      const id = this.selectedProjectId();
      if (id) {
        this.skillsStore.loadSkills({ projectId: id });
        if (this.modalMode() === 'create') {
          this.skillForm.patchValue({ projectId: id });
        }
      } else {
        // Fetch ENTIRE LIST for organization
        this.skillsStore.loadSkills();
      }
    });

    // Default to 'All' (null) initially
    this.selectedProjectId.set(null);
  }

  ngOnInit() {
    window.addEventListener('click', () => this.activeMenuId.set(null));
  }

  selectProject(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedProjectId.set(val === 'all' ? null : val);
  }

  openEditor() {
    this.modalMode.set('create');
    this.editingSkillId.set(null);
    this.skillForm.reset({
      modelName: 'gpt-4o',
      temperature: 0.7,
      projectId: this.selectedProjectId() || this.projects()[0]?.id || ''
    });
    this.showEditor.set(true);
  }

  openEditEditor(event: Event, skill: Skill) {
    event.stopPropagation();
    this.modalMode.set('edit');
    this.editingSkillId.set(skill.id);
    this.skillForm.patchValue({
      name: skill.name,
      description: skill.description || '',
      systemPrompt: skill.systemPrompt,
      modelName: skill.modelName,
      temperature: skill.temperature,
      projectId: skill.projectId
    });
    this.showEditor.set(true);
    this.activeMenuId.set(null);
  }

  closeEditor() {
    this.showEditor.set(false);
    this.editingSkillId.set(null);
    this.testResponse.set('');
    this.testInput.set('');
  }

  toggleMenu(event: Event, id: string) {
    event.stopPropagation();
    this.activeMenuId.set(this.activeMenuId() === id ? null : id);
  }

  async deleteSkill(event: Event, id: string) {
    event.stopPropagation();
    
    const confirmed = await this.confirmStore.ask({
      title: 'Erase Skill',
      message: 'Are you sure you want to erase this skill from existence? This action is irreversible.',
      confirmLabel: 'Erase Skill',
      danger: true
    });

    if (confirmed) {
      this.skillsStore.deleteSkill(id);
    }
    this.activeMenuId.set(null);
  }

  async runTest() {
    const userInput = this.testInput().trim();
    const systemPrompt = this.skillForm.get('systemPrompt')?.value;

    if (!userInput || !systemPrompt) return;

    this.isTesting.set(true);
    this.testResponse.set('');

    try {
      const response = await fetch('/api/v1/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-tenant-id': localStorage.getItem('tenant_id') || ''
        },
        body: JSON.stringify({
          systemPrompt,
          user_input: userInput
        })
      });

      if (!response.ok) throw new Error('Sandbox link failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let accumulated = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.content) {
                accumulated += data.content;
                this.testResponse.set(accumulated);
              }
            } catch (e) {}
          }
        }
      }
    } catch (err: any) {
      this.testResponse.set('Error: ' + err.message);
    } finally {
      this.isTesting.set(false);
    }
  }

  onSubmit() {
    if (this.skillForm.valid) {
      const formValue = this.skillForm.getRawValue();
      const id = this.editingSkillId();
      
      const skillData = {
        name: formValue.name!,
        description: formValue.description || '',
        systemPrompt: formValue.systemPrompt!,
        modelName: formValue.modelName!,
        temperature: formValue.temperature!,
        projectId: formValue.projectId!
      };
      
      if (this.modalMode() === 'create') {
        this.skillsStore.createSkill(skillData);
      } else if (id) {
        this.skillsStore.updateSkill({ id, data: skillData });
      }
      
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
