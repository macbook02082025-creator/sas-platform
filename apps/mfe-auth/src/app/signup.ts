import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthStore } from '@sas-platform/shared-core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./login.scss'], // Reusing login styles for consistency
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  readonly authStore = inject(AuthStore);

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    organizationName: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.signupForm.valid) {
      this.authStore.register(this.signupForm.value);
    }
  }
}
