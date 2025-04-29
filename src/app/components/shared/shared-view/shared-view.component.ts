import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../../services/file.service';
import { File } from '../../../models/file.model';

@Component({
  selector: 'app-shared-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="shared-file" *ngIf="file">
        <h2>{{ file.name }}</h2>
        <div class="file-info">
          <p>Size: {{ formatFileSize(file.size) }}</p>
          <a [href]="file.url" download class="download-button">
            Download File
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .shared-file {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    h2 {
      margin-bottom: 16px;
      color: #1F2937;
    }
    .file-info {
      margin-top: 16px;
    }
    .download-button {
      display: inline-block;
      margin-top: 16px;
      padding: 8px 16px;
      background: #3B82F6;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      transition: background-color 0.2s;
    }
    .download-button:hover {
      background: #2563EB;
    }
  `]
})
export class SharedViewComponent implements OnInit {
  file: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fileService.getFileByShareId(id).subscribe(file => {
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