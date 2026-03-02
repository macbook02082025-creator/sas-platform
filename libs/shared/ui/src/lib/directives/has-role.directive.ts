import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthStore } from '@sas-platform/shared-core';
import { effect } from '@angular/core';

@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private authStore = inject(AuthStore);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  @Input('hasRole') requiredRoles: string | string[] = [];

  constructor() {
    effect(() => {
      const user = this.authStore.user();
      if (!user) {
        this.viewContainer.clear();
        return;
      }

      const roles = Array.isArray(this.requiredRoles) ? this.requiredRoles : [this.requiredRoles];
      // In our simplified schema, user.role is the field
      const hasPermission = roles.includes((user as any).role);

      if (hasPermission) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
