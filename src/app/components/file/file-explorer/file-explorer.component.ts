import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileListComponent } from '../file-list/file-list.component';

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  imports: [CommonModule, FileListComponent],
  template: `
    <div class="container">
      <h2>My Files</h2>
      <app-file-list></app-file-list>
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
export class FileExplorerComponent {}