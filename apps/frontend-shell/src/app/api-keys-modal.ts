import { Component, inject, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiKeysStore, ConfirmStore } from '@sas-platform/shared-core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-api-keys-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './api-keys-modal.html',
  styleUrls: ['./dashboard.scss', './overview.scss'],
})
export class ApiKeysModalComponent {
  readonly apiKeysStore = inject(ApiKeysStore);
  readonly dashboardService = inject(DashboardService);
  readonly confirmStore = inject(ConfirmStore);

  newKeyName = signal('');
  newKeyRevealed = signal<string | null>(null);

  constructor() {
    effect(() => {
      const projectId = this.dashboardService.activeProjectId();
      if (projectId && this.dashboardService.showApiKeyModal()) {
        this.apiKeysStore.loadKeys({ projectId });
        this.newKeyRevealed.set(null);
        this.newKeyName.set('');
      }
    });
  }

  async createKey() {
    const projectId = this.dashboardService.activeProjectId();
    const name = this.newKeyName().trim();
    if (!projectId || !name) return;

    // We need to handle the reveal logic here because the store tap might not return the full object easily
    // Actually our store createKey is rxMethod, we can't easily get the return value back to the component
    // I'll update the store to handle the 'lastCreatedKey' state
    this.apiKeysStore.createKey({ projectId, name });
    this.newKeyName.set('');
  }

  async deleteKey(id: string) {
    const confirmed = await this.confirmStore.ask({
      title: 'Revoke Key',
      message: 'Revoke this API key? Any applications using it will lose access immediately.',
      confirmLabel: 'Revoke',
      danger: true
    });

    if (confirmed) {
      this.apiKeysStore.deleteKey(id);
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
}
