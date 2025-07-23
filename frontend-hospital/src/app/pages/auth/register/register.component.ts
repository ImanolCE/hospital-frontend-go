// src/app/pages/views/auth/register/register.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';

import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
//import { SharedModule } from '../../../shared.module'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    ToastModule
    
  ],
  providers: [ MessageService ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Datos de registro
  username = '';
  apellido = '';
  email = '';
  password = '';
  confirmPassword = '';

  // MFA recovery
  otpauthUrl: string | null = null;
  qrUrl: string | null = null;
  otp = '';

  // Control de pasos en la UI
  paso: 1 | 2 = 1;
  loading = false;

  constructor(
    private auth: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  /** Paso 1: Registrarse */
  onRegister(): void {
    if (this.password !== this.confirmPassword) {
      return alert('Las contraseñas no coinciden');
    }
    this.loading = true;

    const payload = {
      nombre: this.username,
      apellido: this.apellido,
      correo: this.email,
      password: this.password,
      tipo_usuario: 'paciente'
    };

    this.auth.register(payload).subscribe({
      next: res => {
         this.messageService.add({
            severity: 'success',
            summary: 'Registro exitoso',
            detail: 'Usuario creado correctamente'
          });
        // La API devuelve { message, otpauth_url }
        this.otpauthUrl = res.otpauth_url;
        // Generamos la imagen del QR
        this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/` +
                     `?data=${encodeURIComponent(this.otpauthUrl)}&size=200x200`;
        this.paso = 2;         // avanzamos al paso 2: activar MFA
        this.loading = false;
      },
      error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo registrar el usuario'
          });
        }
    });
  }

  /** Paso 2: Activar MFA sin JWT (flujo público) */
  activateRecovery(): void {
    if (!this.otp) {
      return alert('Introduce el código OTP que aparece en tu app');
    }
    this.loading = true;

    this.auth.activateRecoveryMfa(this.email, this.otp).subscribe({
      next: () => {this.messageService.add({
            severity: 'success',
            summary: 'MFA activado',
            detail: 'Autenticación de dos factores activada'
          });
          // Después de activar, redirige al login
          this.router.navigate(['/auth/login']);
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
            summary: 'Error',
            detail: 'No se pudo registrar el usuario'
        });
      }
    });
  }

  /** Volver al login manualmente */
  irAlLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
