import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FileService } from '../../services/file.service';
import { FileListComponent } from '../file/file-list/file-list.component';
import { FolderListComponent } from '../folder/folder-list/folder-list.component';
import { StorageInfoComponent } from '../storage/storage-info/storage-info.component';
import { RecentActivityComponent } from '../activity/recent-activity/recent-activity.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    FileListComponent,
    FolderListComponent,
    StorageInfoComponent,
    RecentActivityComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  recentFiles: any[] = [];
  isLoading = true;
  error: string | null = null;
  storageUsed = 0;
  storageLimit = 1024 * 1024 * 1024; // 1GB
  
  constructor(private fileService: FileService) {}
  
  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  loadDashboardData(): void {
    this.isLoading = true;
    
    this.fileService.getRecentFiles().subscribe({
      next: (files) => {
        this.recentFiles = files;
        this.calculateStorageUsed();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load recent files.';
        this.isLoading = false;
        console.error('Error loading recent files:', err);
      }
    });
  }
  
  calculateStorageUsed(): void {
    // Sum up the sizes of all files
    this.storageUsed = this.recentFiles.reduce((total, file) => total + (file.size || 0), 0);
  }
  
  getStoragePercentage(): number {
    return (this.storageUsed / this.storageLimit) * 100;
  }
}