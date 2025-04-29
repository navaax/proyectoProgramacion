import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.css']
})
export class RecentActivityComponent implements OnInit {
  activities: any[] = [];
  isLoading = true;
  
  ngOnInit(): void {
    // Simulate API call to get recent activities
    setTimeout(() => {
      this.activities = [
        {
          id: 1,
          type: 'upload',
          fileName: 'project-proposal.pdf',
          fileId: '123',
          timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
        },
        {
          id: 2,
          type: 'share',
          fileName: 'company-logo.png',
          fileId: '456',
          recipient: 'john.doe@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        {
          id: 3,
          type: 'create_folder',
          folderName: 'Project Documents',
          folderId: '789',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
        },
        {
          id: 4,
          type: 'delete',
          fileName: 'old-draft.docx',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26) // 26 hours ago
        }
      ];
      
      this.isLoading = false;
    }, 1000);
  }
  
  getActivityIcon(type: string): string {
    switch (type) {
      case 'upload':
        return '⬆️';
      case 'download':
        return '⬇️';
      case 'share':
        return '🔗';
      case 'delete':
        return '🗑️';
      case 'create_folder':
        return '📁';
      case 'move':
        return '📦';
      default:
        return '📄';
    }
  }
  
  getActivityText(activity: any): string {
    switch (activity.type) {
      case 'upload':
        return `Uploaded "${activity.fileName}"`;
      case 'download':
        return `Downloaded "${activity.fileName}"`;
      case 'share':
        return `Shared "${activity.fileName}" with ${activity.recipient}`;
      case 'delete':
        return `Deleted "${activity.fileName}"`;
      case 'create_folder':
        return `Created folder "${activity.folderName}"`;
      case 'move':
        return `Moved "${activity.fileName}" to ${activity.destination}`;
      default:
        return `Interacted with "${activity.fileName}"`;
    }
  }
  
  getTimeAgo(timestamp: Date): string {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    
    let interval = seconds / 31536000; // years
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000; // months
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400; // days
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600; // hours
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60; // minutes
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  }
}