import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../../../services/file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Upload Files</h2>
      <div class="upload-area" 
           (dragover)="onDragOver($event)" 
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)">
        <input type="file" 
               #fileInput 
               (change)="onFileSelected($event)" 
               multiple 
               class="file-input" />
        <div class="upload-content">
          <span class="upload-icon">📤</span>
          <p>Drag and drop files here or click to select</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    h2 {
      margin-bottom: 24px;
      color: #1F2937;
    }
    .upload-area {
      border: 2px dashed #E5E7EB;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      position: relative;
      transition: all 0.3s ease;
    }
    .upload-area:hover {
      border-color: #3B82F6;
      background-color: #F3F4F6;
    }
    .file-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
    .upload-content {
      pointer-events: none;
    }
    .upload-icon {
      font-size: 48px;
      margin-bottom: 16px;
      display: block;
    }
  `]
})
export class FileUploadComponent {
  constructor(
    private fileService: FileService,
    private router: Router
  ) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files) {
      this.uploadFiles(files);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.uploadFiles(input.files);
    }
  }

  private uploadFiles(files: FileList) {
    Array.from(files).forEach(file => {
      this.fileService.uploadFile(file).subscribe({
        next: () => {
          this.router.navigate(['/files']);
        },
        error: (error) => {
          console.error('Upload failed:', error);
        }
      });
    });
  }
}