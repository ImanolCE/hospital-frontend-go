import { Routes } from '@angular/router';
import { LoginComponent } from './pages/views/auth/login/login.component';
import { RegisterComponent } from './pages/views/auth/register/register.component';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: '**', redirectTo: 'auth/login' }
];
