import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  isDragging = signal(false);
  documents = signal<DocumentSource[]>([
    { id: '1', name: 'Product_Documentation_V2.pdf', size: '2.4 MB', status: 'indexed', type: 'pdf', updatedAt: 'Mar 01' },
    { id: '2', name: 'Customer_Support_FAQ.md', size: '45 KB', status: 'indexed', type: 'markdown', updatedAt: 'Feb 28' }
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
    console.log('Files selected:', files);
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

    if (isNaN(date.getTime())) return dateString; // Handle placeholder strings like "Mar 01"
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
