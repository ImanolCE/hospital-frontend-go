import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { Card } from "primeng/card";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading: boolean = false;
activateMfa() {
throw new Error('Method not implemented.');
}
qrUrl: any;
secret: any;
verificarCredenciales() {
throw new Error('Method not implemented.');
}
  email: string = '';
  password: string = '';
  otp: string = '';

  // Map de permisos mínimos por rol
  private requiredPerms: { [role: string]: string[] } = {
    paciente: ['ver_dashboard', 'ver_consultas', ],
    enfermera: ['ver_dashboard', 'ver_usuarios', 'ver_consultas'],
    medico:   ['ver_dashboard','ver_consultas', 'crear_consultas', 'ver_usuarios', 'actualizar_consultas']
  };
  

constructor(private auth: AuthService, private router: Router) {}


onLogin(): void {
  this.auth.login(this.email, this.password, this.otp).subscribe({
     next: tokens => {
        alert('Login exitoso');
        console.log('Token:', tokens.access_token);
        console.log('Refresh:', tokens.refresh_token);

     /*  const token = this.auth.getAccessToken();
      const refresh = localStorage.getItem('refresh_token'); */
     
      const permisos = this.auth.getPermisos();
      const rol = this.auth.getUserRole() || '';

      /* const necesarios = this.requiredPerms[rol] || [];
      const ok = necesarios.every(p => permisos.includes(p));
 */

       // comprueba permisos mínimos según rol
        const reqs = {
          paciente:   ['ver_dashboard','ver_consultas',],
          enfermera:  ['ver_dashboard','ver_usuarios','ver_consultas'],
          medico:     ['ver_dashboard','ver_consultas', 'crear_consultas', 'ver_usuarios', 'actualizar_consultas'],
        }[rol] || [];
    
        if (!reqs.every(p => permisos.includes(p))) {
          alert(`Tu cuenta como ${rol} no tiene los permisos: ${reqs.join(', ')}`);
          return;
        }

      alert(`Bienvenido ${rol || 'usuario'}\nPermisos: ${permisos.join(', ')}`);

      switch (rol) {
        case 'paciente':
          this.router.navigate(['/paciente']);
          break;
        case 'enfermera':
          this.router.navigate(['/enfermera']);
          break;
        case 'medico':
          this.router.navigate(['/medico']);
          break;
        default:
          alert('Rol desconocido');
          break;
      }
    },
    error: err => {
      console.error('Login fallido', err);
      alert('Login fallido: ' + (err.error?.error || err.statusText));
    }
  });
}

 
}