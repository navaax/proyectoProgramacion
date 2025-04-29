import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileListComponent } from '../../file/file-list/file-list.component';
import { FileService } from '../../../services/file.service';
import { File } from '../../../models/file.model';

@Component({
  selector: 'app-shared-files',
  standalone: true,
  imports: [CommonModule, FileListComponent],
  template: `
    <div class="container">
      <h2>Shared with Me</h2>
      <app-file-list [files]="files"></app-file-list>
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
  `]
})
export class SharedFilesComponent implements OnInit {
  files: File[] = [];

  constructor(private fileService: FileService) {}

  ngOnInit() {
    this.fileService.getSharedFiles().subscribe(files => {
      this.files = files;
    });
  }
}