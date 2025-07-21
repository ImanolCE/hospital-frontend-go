import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  apellido: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  otpauthUrl: string | null = null;
  qrUrl: string | null = null;
  otp: string = '';  // input para código OTP


  constructor(private auth: AuthService, private router: Router) {}

  onRegister(): void {
    const payload = {
      nombre: this.username,
      apellido: this.apellido,
      correo: this.email,
      password: this.password,
      tipo_usuario: 'paciente'
    };

    console.log(' Enviando datos:', payload);

    this.auth.register(payload).subscribe({
      next: res => {
        // Ya accedes directo porque el service devuelve res.data[0]
        console.log(' Registro ok:', res.message);
        this.otpauthUrl = res.otpauth_url;
        this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(this.otpauthUrl)}&size=200x200`;

      },
      error: err => {
        console.error(' Registro fallido', err);
        alert('Registro fallido: ' + err.statusText);
      }
    });
  }

  activarMFA(): void {
    if (!this.otp || !this.email) {
      alert("Debes ingresar el código OTP y el correo.");
      return;
    }

    this.auth.activateMfa(this.otp).subscribe({
      next: () => {
        alert("MFA activado. Ahora puedes iniciar sesión.");
        this.irAlLogin(); // Redirige al login
      },
      error: err => {
        console.error('Error al activar MFA', err);
        alert('Error al activar MFA: ' + err.error?.message || err.statusText);
      }
    });
  }

  irAlLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}