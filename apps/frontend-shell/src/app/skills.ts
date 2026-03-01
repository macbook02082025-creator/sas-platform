import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SkillsStore } from '@sas-platform/shared-core';

@Component({
  selector: 'app-skill-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss'],
})
export class SkillEditorComponent {
  private fb = inject(FormBuilder);
  readonly skillsStore = inject(SkillsStore);

  skillForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    systemPrompt: ['', [Validators.required]],
    modelName: ['gpt-4o'],
    temperature: [0.7, [Validators.min(0), Validators.max(2)]],
  });

  onSubmit() {
    if (this.skillForm.valid) {
      // In a real app, we'd get the projectId from the active project store
      this.skillsStore.createSkill({
        ...this.skillForm.value,
        projectId: 'demo-project-id' 
      } as any);
    }
  }
}
