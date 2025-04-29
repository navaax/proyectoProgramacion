import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-storage-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './storage-info.component.html',
  styleUrls: ['./storage-info.component.css']
})
export class StorageInfoComponent {
  @Input() storageUsed = 0;
  @Input() storageLimit = 1024 * 1024 * 1024; // 1GB default
  
  getStoragePercentage(): number {
    return (this.storageUsed / this.storageLimit) * 100;
  }
  
  formatStorage(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  getProgressColor(): string {
    const percentage = this.getStoragePercentage();
    
    if (percentage > 90) {
      return '#EF4444'; // Red (danger)
    } else if (percentage > 75) {
      return '#F59E0B'; // Yellow (warning)
    } else {
      return '#3B82F6'; // Blue (default)
    }
  }
}