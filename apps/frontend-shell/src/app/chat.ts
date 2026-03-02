import { Component, inject, signal, computed, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectsStore, SkillsStore, AuthStore } from '@sas-platform/shared-core';

import { Message } from '@sas-platform/shared-dto';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./dashboard.scss', './chat.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private route = inject(ActivatedRoute);
  private projectsStore = inject(ProjectsStore);
  private skillsStore = inject(SkillsStore);
  private authStore = inject(AuthStore);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  projectId = signal<string | null>(null);
  userInput = signal('');
  messages = signal<Message[]>([]);
  isThinking = signal(false);

  project = computed(() => 
    this.projectsStore.projects().find(p => p.id === this.projectId())
  );

  skills = computed(() => this.skillsStore.skills());

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId.set(params['id']);
      if (params['id']) {
        this.skillsStore.loadSkills({ projectId: params['id'] });
      }
    });

    // Welcome message
    this.messages.set([{
      role: 'assistant',
      content: 'Neural link established. Intelligence unit ready for directive. How can I assist you today?',
      timestamp: new Date()
    }]);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async sendMessage() {
    const text = this.userInput().trim();
    if (!text || this.isThinking()) return;

    // Use the first skill of the project if available, otherwise we can't really chat properly
    const activeSkill = this.skills()[0];
    if (!activeSkill) {
      this.messages.update(prev => [...prev, {
        role: 'assistant',
        content: 'No active skill found for this project. Please forge a skill first.',
        timestamp: new Date()
      }]);
      return;
    }

    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    this.messages.update(prev => [...prev, userMsg]);
    this.userInput.set('');
    this.isThinking.set(true);

    const assistantMsg: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };
    this.messages.update(prev => [...prev, assistantMsg]);

    try {
      const response = await fetch('/api/v1/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-tenant-id': localStorage.getItem('tenant_id') || ''
        },
        body: JSON.stringify({
          skillId: activeSkill.id,
          user_input: text
        })
      });

      if (!response.ok) throw new Error('Failed to connect to neural engine');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) throw new Error('No readable stream');

      let accumulatedContent = '';

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
                accumulatedContent += data.content;
                this.messages.update(msgs => {
                  const last = msgs[msgs.length - 1];
                  last.content = accumulatedContent;
                  return [...msgs];
                });
              }
            } catch (e) {
              // Ignore partial JSON or non-JSON lines
            }
          } else if (line.startsWith('event: end')) {
            // Stream finished
          }
        }
      }

      this.isThinking.set(false);
      this.messages.update(msgs => {
        msgs[msgs.length - 1].isStreaming = false;
        return [...msgs];
      });

    } catch (error: any) {
      // In a real app, send to an observability platform like LangSmith or DataDog
      this.isThinking.set(false);
      this.messages.update(msgs => {
        const last = msgs[msgs.length - 1];
        last.content = 'Neural link interrupted: ' + error.message;
        last.isStreaming = false;
        return [...msgs];
      });
    }
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }
}
