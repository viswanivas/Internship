import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,private router:Router) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if the user is already logged in
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (loggedInUser && loggedInUser.name) {
      // Redirect to the auth page if the user is logged in
      this.router.navigate(['/auth']);
    }
  }

  onLogin() { 
    const loginData = this.loginForm.value;
     console.log('login data', loginData.userName, loginData.password); 
     const signupData = JSON.parse(localStorage.getItem('signupData') || '[]'); 
     if (Array.isArray(signupData)) { 
      const user = signupData.find((user: any) => user.name === loginData.userName && user.password === loginData.password); 
      if (user) { 
        localStorage.setItem('loggedInUser', JSON.stringify(user)); 
        alert('Login successful'); 
        if (user.role === 'admin') {
        this.router.navigate(['/auth']); 
        }else {
          this.router.navigate(['/products']);
        }

      } else {
         alert('Invalid credentials'); 
        } 
      } else {
         alert('Invalid credentials');
    }

  }
}