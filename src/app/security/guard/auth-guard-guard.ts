import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
   const router = inject(Router);
    const token = localStorage.getItem('Token');
  
  

  if (token) {
    return true; // Allow access if token exists
  } else {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } }); // Redirect to login
    return false; // Block access
  }
};