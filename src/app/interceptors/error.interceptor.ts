import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Auto logout if 401 response returned from API
        authService.logout();
        router.navigate(['/login']);
      }
      
      // Handle CSRF token expiration or invalidation
      if (error.status === 403 && error.error?.message?.includes('CSRF')) {
        // You might want to refresh the CSRF token here if your API supports it
        console.error('CSRF token expired or invalid');
      }
      
      // Log errors for debugging in development (you'd remove this in production)
      console.error('API Error:', error);
      
      // Return standardized error message to components
      const errorMessage = error.error?.message || error.statusText || 'Unknown error occurred';
      return throwError(() => new Error(errorMessage));
    })
  );
};