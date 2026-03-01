import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DocumentSource {
  id: string;
  name: string;
  size: string;
  status: 'indexed' | 'processing' | 'error';
  type: string;
}

@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './knowledge.html',
  styleUrls: ['./knowledge.scss'],
})
export class KnowledgeBaseComponent {
  isDragging = signal(false);
  documents = signal<DocumentSource[]>([
    { id: '1', name: 'Product_Documentation_V2.pdf', size: '2.4 MB', status: 'indexed', type: 'pdf' },
    { id: '2', name: 'Customer_Support_FAQ.md', size: '45 KB', status: 'indexed', type: 'markdown' }
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
    // In Week 4, we will connect this to the NestJS upload API
    console.log('Files selected:', files);
  }
}
