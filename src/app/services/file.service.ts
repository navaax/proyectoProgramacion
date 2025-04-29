import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpParams } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { File } from '../models/file.model';

export interface UploadProgress {
  progress: number;
  file: { name: string; size: number };
  status: 'uploading' | 'success' | 'error';
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/files`;
  private uploadProgressSubject = new Subject<UploadProgress>();
  public uploadProgress$ = this.uploadProgressSubject.asObservable();
  
  constructor(private http: HttpClient) {}
  
  getFiles(folderId?: string): Observable<File[]> {
    let params = new HttpParams();
    if (folderId) {
      params = params.set('folderId', folderId);
    }
    
    return this.http.get<File[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error getting files', error);
        return of([]);
      })
    );
  }
  
  getRecentFiles(limit: number = 5): Observable<File[]> {
    const params = new HttpParams().set('limit', limit.toString());
    
    return this.http.get<File[]>(`${this.apiUrl}/recent`, { params }).pipe(
      catchError(error => {
        console.error('Error getting recent files', error);
        return of([]);
      })
    );
  }
  
  getFile(id: string): Observable<File> {
    return this.http.get<File>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error getting file with ID ${id}`, error);
        throw error;
      })
    );
  }
  
  uploadFile(file: Blob, folderId?: string): Observable<File> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (folderId) {
      formData.append('folderId', folderId);
    }
    
    const progress: UploadProgress = {
      progress: 0,
      file: { name: (file as any).name || 'Unknown file', size: file.size },
      status: 'uploading'
    };
    
    return this.http.post<File>(
      `${this.apiUrl}/upload`,
      formData,
      { reportProgress: true, observe: 'events' }
    ).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const total = event.total || 0;
            progress.progress = Math.round(100 * event.loaded / total);
            this.uploadProgressSubject.next({...progress});
            return {} as File;
            
          case HttpEventType.Response:
            progress.status = 'success';
            progress.progress = 100;
            this.uploadProgressSubject.next({...progress});
            return event.body;
            
          default:
            return {} as File;
        }
      }),
      catchError(error => {
        progress.status = 'error';
        progress.message = error.error?.message || 'Upload failed';
        this.uploadProgressSubject.next({...progress});
        throw error;
      })
    );
  }
  
  deleteFile(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting file with ID ${id}`, error);
        throw error;
      })
    );
  }
  
  shareFile(id: string, shareData: { expiresAt?: Date, password?: string }): Observable<{ shareLink: string }> {
    return this.http.post<{ shareLink: string }>(`${this.apiUrl}/${id}/share`, shareData).pipe(
      catchError(error => {
        console.error(`Error sharing file with ID ${id}`, error);
        throw error;
      })
    );
  }
  
  getSharedFiles(): Observable<File[]> {
    return this.http.get<File[]>(`${this.apiUrl}/shared`).pipe(
      catchError(error => {
        console.error('Error getting shared files', error);
        return of([]);
      })
    );
  }
  
  getFileByShareId(shareId: string, password?: string): Observable<File> {
    let params = new HttpParams();
    if (password) {
      params = params.set('password', password);
    }
    
    return this.http.get<File>(`${this.apiUrl}/share/${shareId}`, { params }).pipe(
      catchError(error => {
        console.error(`Error getting shared file with ID ${shareId}`, error);
        throw error;
      })
    );
  }
}