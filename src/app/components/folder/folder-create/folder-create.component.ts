import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FolderService } from '../../../services/folder.service';

@Component({
  selector: 'app-folder-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>Create New Folder</h2>
      <form [formGroup]="folderForm" (ngSubmit)="onSubmit()" class="form">
        <div class="form-group">
          <label for="name">Folder Name</label>
          <input type="text" 
                 id="name" 
                 formControlName="name" 
                 placeholder="Enter folder name"
                 class="input" />
          <div class="error" *ngIf="name?.invalid && (name?.dirty || name?.touched)">
            <span *ngIf="name?.errors?.['required']">Folder name is required</span>
          </div>
        </div>
        <button type="submit" 
                [disabled]="folderForm.invalid || isLoading" 
                class="button">
          {{ isLoading ? 'Creating...' : 'Create Folder' }}
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
    .error {
      color: #EF4444;
      font-size: 0.875rem;
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
export class FolderCreateComponent {
  folderForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private folderService: FolderService,
    private router: Router
  ) {
    this.folderForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  get name() { return this.folderForm.get('name'); }

  onSubmit() {
    if (this.folderForm.invalid) return;

    this.isLoading = true;
    this.folderService.createFolder(this.folderForm.value).subscribe({
      next: () => {
        this.router.navigate(['/files']);
      },
      error: (error) => {
        console.error('Failed to create folder:', error);
        this.isLoading = false;
      }
    });
  }
}