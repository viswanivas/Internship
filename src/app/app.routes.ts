import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { AuthComponent } from './components/auth/auth.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { TestprodComponent } from './testprod/testprod.component';

import { authGuard } from './auth.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: '', redirectTo:"/home",pathMatch:"full"},
  { path: 'home', component: HomeComponent },
  // { path:'products',component:ProductsComponent},
  { path:'products',component:TestprodComponent,canActivate: [authGuard]},
  { path: 'contact', component: ContactusComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path:'auth',component:AuthComponent,canActivate: [authGuard], data: { role: 'admin' } },
  { path:'create-product',component:CreateProductComponent,canActivate: [authGuard]},
 {path :'unauthorized',component:UnauthorizedComponent},
 ];

