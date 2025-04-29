import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FileListComponent } from '../../file/file-list/file-list.component';
import { FolderService } from '../../../services/folder.service';
import { FileService } from '../../../services/file.service';
import { Folder } from '../../../models/folder.model';
import { File } from '../../../models/file.model';

@Component({
  selector: 'app-folder-detail',
  standalone: true,
  imports: [CommonModule, FileListComponent],
  template: `
    <div class="container" *ngIf="folder">
      <h2>{{ folder.name }}</h2>
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
export class FolderDetailComponent implements OnInit {
  folder: Folder | null = null;
  files: File[] = [];

  constructor(
    private route: ActivatedRoute,
    private folderService: FolderService,
    private fileService: FileService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.folderService.getFolder(id).subscribe(folder => {
        this.folder = folder;
        this.loadFiles(id);
      });
    }
  }

  private loadFiles(folderId: string) {
    this.fileService.getFiles(folderId).subscribe(files => {
      this.files = files;
    });
  }
}