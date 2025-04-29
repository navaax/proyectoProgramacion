import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>Profile Settings</h2>
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" 
                 id="name" 
                 formControlName="name" 
                 class="input" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" 
                 id="email" 
                 formControlName="email" 
                 class="input" 
                 readonly />
        </div>
        <button type="submit" 
                [disabled]="profileForm.invalid || isLoading" 
                class="button">
          {{ isLoading ? 'Saving...' : 'Save Changes' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    h2 {
      margin-bottom: 24px;
      color: #1F2937;
    }
    .form {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .form-group {
      margin-bottom: 16px;
    }
    .input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      margin-top: 4px;
    }
    .button {
      width: 100%;
      padding: 12px;
      background: #3B82F6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .button:disabled {
      background: #9CA3AF;
      cursor: not-allowed;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  user: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email
      });
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) return;
    // Implement profile update logic here
  }
}