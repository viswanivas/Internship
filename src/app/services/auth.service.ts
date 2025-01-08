import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(this.isUserLoggedIn());

  isLoggedIn$ = this.loggedIn.asObservable();

  constructor() {}

  // Set login state
  setLoggedIn(status: boolean): void {
    this.loggedIn.next(status);
  }

  // Check if user is logged in (from localStorage or other mechanisms)
  isUserLoggedIn(): boolean {
    const loggedInUser = localStorage.getItem('loggedInUser');
    return !!loggedInUser;
  }
}
