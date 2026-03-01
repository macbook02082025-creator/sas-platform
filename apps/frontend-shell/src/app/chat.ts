import { Component, inject, signal, computed, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectsStore, SkillsStore } from '@sas-platform/shared-core';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

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

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  projectId = signal<string | null>(null);
  userInput = signal('');
  messages = signal<Message[]>([]);
  isThinking = signal(false);

  project = computed(() => 
    this.projectsStore.projects().find(p => p.id === this.projectId())
  );

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

  sendMessage() {
    const text = this.userInput().trim();
    if (!text || this.isThinking()) return;

    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    this.messages.update(prev => [...prev, userMsg]);
    this.userInput.set('');
    this.isThinking.set(true);

    // Mock streaming response for now (Week 4 real SSE integration coming)
    setTimeout(() => {
      const assistantMsg: Message = {
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      };
      this.messages.update(prev => [...prev, assistantMsg]);
      
      const fullResponse = "Based on my current neural configuration and indexed metadata, I've analyzed your request. I am processing the context through the active skills lab protocols.";
      let i = 0;
      const interval = setInterval(() => {
        this.messages.update(msgs => {
          const last = msgs[msgs.length - 1];
          last.content = fullResponse.substring(0, i);
          return [...msgs];
        });
        i += 3;
        if (i > fullResponse.length) {
          clearInterval(interval);
          this.isThinking.set(false);
          this.messages.update(msgs => {
            msgs[msgs.length - 1].isStreaming = false;
            return [...msgs];
          });
        }
      }, 30);
    }, 1000);
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }
}
