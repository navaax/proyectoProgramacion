import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { File } from '../../../models/file.model';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent {
  @Input() files: File[] = [];
  @Input() showActions = true;
  @Input() maxItems: number | null = null;
  @Output() fileDeleted = new EventEmitter<string>();
  
  selectedFile: File | null = null;
  shareDialogOpen = false;
  shareLink = '';
  isLoading = false;
  error: string | null = null;
  
  constructor(private fileService: FileService) {}
  
  get displayedFiles(): File[] {
    if (this.maxItems && this.files.length > this.maxItems) {
      return this.files.slice(0, this.maxItems);
    }
    return this.files;
  }
  
  getFileIcon(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📋';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'mp3':
      case 'wav':
        return '🎵';
      case 'mp4':
      case 'mov':
      case 'avi':
        return '🎞️';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📄';
    }
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  openShareDialog(file: File): void {
    this.selectedFile = file;
    this.shareDialogOpen = true;
    this.shareLink = '';
    this.error = null;
  }
  
  closeShareDialog(): void {
    this.shareDialogOpen = false;
    this.selectedFile = null;
  }
  
  shareFile(): void {
    if (!this.selectedFile) return;
    
    this.isLoading = true;
    this.error = null;
    
    this.fileService.shareFile(this.selectedFile.id, {}).subscribe({
      next: (response) => {
        this.shareLink = response.shareLink;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to create share link. Please try again.';
        this.isLoading = false;
        console.error('Error sharing file:', err);
      }
    });
  }
  
  copyShareLink(): void {
    navigator.clipboard.writeText(this.shareLink).then(
      () => {
        // Success
      },
      () => {
        this.error = 'Failed to copy to clipboard. Please copy the link manually.';
      }
    );
  }
  
  deleteFile(file: File, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    if (confirm(`Are you sure you want to delete ${file.name}?`)) {
      this.fileService.deleteFile(file.id).subscribe({
        next: () => {
          this.fileDeleted.emit(file.id);
          // Remove the file from the local list
          this.files = this.files.filter(f => f.id !== file.id);
        },
        error: (err) => {
          console.error('Error deleting file:', err);
          alert('Failed to delete file. Please try again.');
        }
      });
    }
  }
}