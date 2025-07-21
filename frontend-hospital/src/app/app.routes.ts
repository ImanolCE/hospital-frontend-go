import { Routes } from '@angular/router';
import { LoginComponent } from './pages/views/auth/login/login.component';
import { RegisterComponent } from './pages/views/auth/register/register.component';

import { RecuperarMfaComponent } from './pages/views/auth/recuperar-mfa/recuperar-mfa.component';

import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'auth/login',    component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/recuperar-mfa',component: RecuperarMfaComponent},

  { 
    path: 'paciente',
    canActivate: [AuthGuard],
    //data: { permisos: ['ver_dashboard','ver_consultas','ver_expediente'] },
    data: { permisos: ['ver_dashboard','ver_consultas'] },
    loadComponent: () => import('./pages/views/paciente/dashboard/dashboard.component')
                         .then(m => m.DashboardPacienteComponent),
  },
  { 
    path: 'enfermera',
    canActivate: [AuthGuard],
    data: { permisos: ['ver_dashboard','ver_usuarios','ver_consultas'] },
    loadComponent: () => import('./pages/views/enfermera/dashboard/dashboard.component')
                         .then(m => m.DashboardEnfermeraComponent),
  },
  { 
    path: 'medico',
    canActivate: [AuthGuard],
    //data: { permisos: ['ver_dashboard','ver_consultas','ver_horarios','ver_expediente'] },
    data: { permisos: ['ver_dashboard','ver_consultas', 'crear_consultas', 'ver_usuarios', 'actualizar_consultas'] },
    loadComponent: () => import('./pages/views/medico/dashboard/dashboard.component')
                         .then(m => m.DashboardMedicoComponent),
  },

  {
    path: 'auth/activar-mfa',
    loadComponent: () =>
      import('./pages/views/auth/activar-mfa/activar-mfa.component').then(m => m.ActivarMFAComponent),
  },


  // ← siempre al final
  { path: '**', redirectTo: 'auth/login' },
];
