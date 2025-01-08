import { Component,OnInit } from '@angular/core';
import { RouterModule,Router} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule,CommonModule,],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit{
  username: string | null = ''; 
  email: string | null = '';

  ngOnInit() { 
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}'); 
    console.log('LoggedIn User:', loggedInUser); // Debug
    if (loggedInUser && loggedInUser.name && loggedInUser.email) { 
      this.username = loggedInUser.name; this.email = loggedInUser.email; 
    } else {
      // Redirect to login if the user is not logged in
      this.router.navigate(['/login']);
    }
  }

  constructor(private router: Router) {}
 
  logout()
  { 
    console.log('Logout triggered');
    localStorage.removeItem('loggedInUser');
     this.router.navigate(['/home']);
     }

     getUserInfo() {
      const user = localStorage.getItem('loggedInUser');
      return user ? JSON.parse(user) : null;
    }
}
