import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';  // Correct path to your footer component
import { Router, RouterModule } from '@angular/router';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,NavbarComponent,FooterComponent,RouterModule,ReactiveFormsModule],  // Import both components
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  roles: string[] = ['user', 'admin']; // Add roles

  constructor(private fb: FormBuilder,private router:Router) { 
    this.signupForm = this.fb.group({ 
      name: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required], 
      repeatPassword: ['', Validators.required],
      role: ['user', Validators.required], // Default role set to 'user'
      terms: [false, Validators.requiredTrue] }); 
      }

      onSubmit() { 
        if (this.signupForm.valid) { 
          let signupData = JSON.parse(localStorage.getItem('signupData') || '[]'); 
          if (!Array.isArray(signupData)) {
             signupData = [];
             } 
             const userData = { ...this.signupForm.value }; // Extract form data
             delete userData.repeatPassword; // Remove repeat password as it's not needed for storage

             signupData.push(this.signupForm.value);
              localStorage.setItem('signupData', JSON.stringify(signupData)); 
              console.log('Signup data stored:', this.signupForm.value); 
              alert('Account created successfully');
               this.router.navigate(['/login']); 
              } else { 
                console.log('Form is invalid'); } }

        logValidationErrors() { 
          Object.keys(this.signupForm.controls).forEach(key => { const controlErrors = this.signupForm.get(key)?.errors;
             if (controlErrors != null) { 
              Object.keys(controlErrors).forEach(keyError => { 
                console.log(`Key control: ${key}, keyError: ${keyError}, error value: ${controlErrors[keyError]}`);
               });
               } 
              }); 
            }

    }
