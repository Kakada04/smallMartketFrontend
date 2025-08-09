import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('Token');

  // Skip interceptor for login and register endpoints
  if (req.url.includes('/login') || req.url.includes('/register')) {
    return next(req);
  }

  // Initialize headers object
  let headers = req.headers;

  // Add Authorization header if token exists
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // // Add Content-Type: application/json for requests with a body
  // if (req.body && !headers.has('Content-Type')) {
  //   headers = headers.set('Content-Type', 'application/json');
  // }

  // Clone the request with updated headers
  const newReq = req.clone({ headers });

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('Token');
        router.navigate([''], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => error);
    })
  );
};