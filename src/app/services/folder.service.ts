import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Folder } from '../models/folder.model';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private apiUrl = `${environment.apiUrl}/folders`;
  
  constructor(private http: HttpClient) {}
  
  getFolders(parentId?: string): Observable<Folder[]> {
    let params = new HttpParams();
    if (parentId) {
      params = params.set('parentId', parentId);
    }
    
    return this.http.get<Folder[]>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Error getting folders', error);
        return of([]);
      })
    );
  }
  
  getFolder(id: string): Observable<Folder> {
    return this.http.get<Folder>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error getting folder with ID ${id}`, error);
        throw error;
      })
    );
  }
  
  createFolder(data: { name: string; parentId?: string }): Observable<Folder> {
    return this.http.post<Folder>(this.apiUrl, data).pipe(
      catchError(error => {
        console.error('Error creating folder', error);
        throw error;
      })
    );
  }
  
  updateFolder(id: string, data: { name: string }): Observable<Folder> {
    return this.http.patch<Folder>(`${this.apiUrl}/${id}`, data).pipe(
      catchError(error => {
        console.error(`Error updating folder with ID ${id}`, error);
        throw error;
      })
    );
  }
  
  deleteFolder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting folder with ID ${id}`, error);
        throw error;
      })
    );
  }
}