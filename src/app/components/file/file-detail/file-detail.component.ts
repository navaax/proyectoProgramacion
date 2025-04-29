import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../../services/file.service';
import { File } from '../../../models/file.model';

@Component({
  selector: 'app-file-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" *ngIf="file">
      <h2>{{ file.name }}</h2>
      <div class="file-info">
        <p>Size: {{ formatFileSize(file.size) }}</p>
        <p>Uploaded: {{ file.createdAt | date }}</p>
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
      margin-bottom: 16px;
      color: #1F2937;
    }
    .file-info {
      background: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class FileDetailComponent implements OnInit {
  file: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fileService.getFile(id).subscribe(file => {
        this.file = file;
      });
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}