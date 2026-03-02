import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { ConfirmStore } from '@sas-platform/shared-core';

interface DocumentSource {
  id: string;
  name: string;
  size: string;
  status: 'indexed' | 'processing' | 'error';
  type: string;
  updatedAt: string;
}

@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './knowledge.html',
  styleUrls: ['./dashboard.scss', './knowledge.scss'],
})
export class KnowledgeBaseComponent implements OnInit {
  private http = inject(HttpClient);
  readonly confirmStore = inject(ConfirmStore);
  
  readonly layout = signal<'grid' | 'list' | 'details'>('grid');
  isDragging = signal(false);
  isUploading = signal(false);
  
  // Menu state
  readonly activeMenuId = signal<string | null>(null);
  
  documents = signal<DocumentSource[]>([]);

  ngOnInit() {
    this.fetchDocuments();
    
    // Global click listener to close menus
    window.addEventListener('click', () => this.activeMenuId.set(null));
  }

  toggleMenu(event: Event, id: string) {
    event.stopPropagation();
    this.activeMenuId.set(this.activeMenuId() === id ? null : id);
  }

  fetchDocuments() {
    this.http.get<DocumentSource[]>('/api/v1/knowledge/all')
      .subscribe({
        next: (docs) => this.documents.set(docs),
        error: (err) => console.error('Failed to fetch documents', err)
      });
  }

  async deleteDocument(id: string | Event, docId?: string) {
    // Handle both direct call from details view and menu call
    let targetId: string;
    if (typeof id === 'string') {
      targetId = id;
    } else {
      id.stopPropagation();
      targetId = docId!;
    }

    const confirmed = await this.confirmStore.ask({
      title: 'Delete Source',
      message: 'Are you sure you want to purge this data source from the vault? This action cannot be undone.',
      confirmLabel: 'Purge Source',
      danger: true
    });

    if (confirmed) {
      this.http.post(`/api/v1/knowledge/${targetId}/delete`, {}).subscribe({
        next: () => this.fetchDocuments(),
        error: (err) => console.error('Failed to delete document', err)
      });
    }
    this.activeMenuId.set(null);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave() {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  private handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.uploadFile(files[i]);
    }
  }

  private uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const newDoc: DocumentSource = {
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: this.formatBytes(file.size),
      status: 'processing',
      type: file.name.split('.').pop() || 'unknown',
      updatedAt: new Date().toISOString()
    };

    this.documents.update(docs => [newDoc, ...docs]);
    this.isUploading.set(true);

    this.http.post('/api/v1/knowledge/upload', formData)
      .pipe(finalize(() => this.isUploading.set(false)))
      .subscribe({
        next: (res: any) => {
          this.fetchDocuments(); // Refresh from DB
        },
        error: (err) => {
          this.documents.update(docs => 
            docs.map(d => d.id === newDoc.id ? { ...d, status: 'error' } : d)
          );
        }
      });
  }

  private formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (isNaN(date.getTime())) return dateString;
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
