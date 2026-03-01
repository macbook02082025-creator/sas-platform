import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';

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
export class KnowledgeBaseComponent {
  private http = inject(HttpClient);
  
  isDragging = signal(false);
  isUploading = signal(false);
  
  documents = signal<DocumentSource[]>([
    { id: '1', name: 'Product_Documentation_V2.pdf', size: '2.4 MB', status: 'indexed', type: 'pdf', updatedAt: new Date('2026-03-01T10:00:00').toISOString() },
    { id: '2', name: 'Customer_Support_FAQ.md', size: '45 KB', status: 'indexed', type: 'markdown', updatedAt: new Date('2026-02-28T15:30:00').toISOString() }
  ]);

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
          this.documents.update(docs => 
            docs.map(d => d.id === newDoc.id ? { ...d, status: 'indexed' } : d)
          );
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
