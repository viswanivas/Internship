import { CanActivateFn,Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Using inject for Router
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  
  // Check if the user is logged in and has a role
  if (loggedInUser && loggedInUser.name) {
    // Check for admin access if required by the route
    const requiredRole = route.data?.['role']; // Get the role requirement from route data

    if (!requiredRole || loggedInUser.role === requiredRole) {
      return true; // Allow access if no specific role is required or the role matches
    } 
    else {
      console.log('You do not have permission to access this page');
      alert('You do not have permission to access this page');
      router.navigate(['/unauthorized']); // Redirect unauthorized users
      return false;
    }
  } else {
    alert('Please log in to access this page');
    router.navigate(['/login']);
    return false;
  }
};
