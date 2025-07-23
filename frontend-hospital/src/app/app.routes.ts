import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

import { RecuperarMfaComponent } from './pages/auth/recuperar-mfa/recuperar-mfa.component';

import { AuthGuard } from './guards/auth.guard';
import { NotAuthorizedComponent } from './pages/not-authorized/not-authorized.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  { path: 'auth/login',    component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/recuperar-mfa',component: RecuperarMfaComponent},

  { path: 'not-authorized', component: NotAuthorizedComponent },

  { 
    path: 'paciente',
    canActivate: [AuthGuard],
    //data: { permisos: ['ver_dashboard','ver_consultas','ver_expediente'] },
    data: { permisos: ['ver_dashboard','ver_consultas'] },
    loadComponent: () => import('./pages/paciente/dashboard/dashboard.component')
                         .then(m => m.DashboardPacienteComponent),
  },
  { 
    path: 'enfermera',
    canActivate: [AuthGuard],
    data: { permisos: ['ver_dashboard','ver_usuarios','ver_consultas'] },
    loadComponent: () => import('./pages/enfermera/dashboard/dashboard.component')
                         .then(m => m.DashboardEnfermeraComponent),
  },
  { 
    path: 'medico',
    canActivate: [AuthGuard],
    //data: { permisos: ['ver_dashboard','ver_consultas','ver_horarios','ver_expediente'] },
    data: { permisos: ['ver_dashboard','ver_consultas', 'crear_consultas', 'ver_usuarios', 'actualizar_consultas'] },
    loadComponent: () => import('./pages/medico/dashboard/dashboard.component')
                         .then(m => m.DashboardMedicoComponent),
  },

  {
    path: 'auth/activar-mfa',
    loadComponent: () =>
      import('./pages/auth/activar-mfa/activar-mfa.component').then(m => m.ActivarMFAComponent),
  },

  // ← siempre al final
  { path: '**', redirectTo: 'auth/login' },
];
