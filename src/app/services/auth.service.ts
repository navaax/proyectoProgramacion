import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  
  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }
  
  private loadUserFromStorage() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        // Decode the JWT to get user info
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedToken = JSON.parse(atob(base64));
        
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          const user: User = {
            id: decodedToken.id,
            name: decodedToken.name,
            email: decodedToken.email
          };
          this.currentUserSubject.next(user);
        } else {
          // Token expired
          this.logout();
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout();
      }
    }
  }
  
  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          this.currentUserSubject.next(response.user);
        }),
        map(response => response.user),
        catchError(error => {
          console.error('Login error', error);
          return throwError(() => new Error(error.error?.message || 'Invalid credentials'));
        })
      );
  }
  
  register(userData: { name: string; email: string; password: string }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError(error => {
          console.error('Registration error', error);
          return throwError(() => new Error(error.error?.message || 'Registration failed'));
        })
      );
  }
  
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}