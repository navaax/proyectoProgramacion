import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Folder } from '../../../models/folder.model';
import { FolderService } from '../../../services/folder.service';

@Component({
  selector: 'app-folder-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.css']
})
export class FolderListComponent implements OnInit {
  @Input() parentId?: string;
  @Input() maxItems: number | null = null;
  
  folders: Folder[] = [];
  isLoading = true;
  error: string | null = null;
  
  constructor(private folderService: FolderService) {}
  
  ngOnInit(): void {
    this.loadFolders();
  }
  
  loadFolders(): void {
    this.isLoading = true;
    this.folderService.getFolders(this.parentId).subscribe({
      next: (folders) => {
        this.folders = folders;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load folders.';
        this.isLoading = false;
        console.error('Error loading folders:', err);
      }
    });
  }
  
  get displayedFolders(): Folder[] {
    if (this.maxItems && this.folders.length > this.maxItems) {
      return this.folders.slice(0, this.maxItems);
    }
    return this.folders;
  }
  
  deleteFolder(folder: Folder, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    if (confirm(`Are you sure you want to delete folder "${folder.name}"? All contents will be deleted.`)) {
      this.folderService.deleteFolder(folder.id).subscribe({
        next: () => {
          // Remove folder from the list
          this.folders = this.folders.filter(f => f.id !== folder.id);
        },
        error: (err) => {
          console.error('Error deleting folder:', err);
          alert('Failed to delete folder. Please try again.');
        }
      });
    }
  }
}