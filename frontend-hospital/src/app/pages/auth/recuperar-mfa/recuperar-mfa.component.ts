import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importa SOLO los módulos de PrimeNG que uses:
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
//import { SharedModule } from '../../../shared.module'

@Component({
  selector: 'app-recuperar-mfa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    
  ],
  templateUrl: './recuperar-mfa.component.html',
  styleUrls: ['./recuperar-mfa.component.css']
})

export class RecuperarMfaComponent {
  correo = '';
  password = '';
  otp = '';
  qrUrl = '';
  qrImageUrl = '';      
  secret = '';
  paso: 1 | 2 = 1;
  loading = false;

    constructor(private authService: AuthService, private router: Router) {}

    verificarCredenciales(): void {
    this.loading = true;
    this.authService.recoverMfa(this.correo, this.password).subscribe({
      next: ({ otpAuthUrl, secret }) => {
        this.qrUrl = otpAuthUrl;
        this.secret = secret;
        // Construye aquí la URL del PNG usando un generador externo:
        this.qrImageUrl =
          'https://api.qrserver.com/v1/create-qr-code/?data=' +
          encodeURIComponent(otpAuthUrl) +
          '&size=200x200';
        this.paso = 2;
        this.loading = false;
      },
      error: err => {
        alert('Error: ' + (err.error?.error || err.message));
        this.loading = false;
      }
    });
  }

  activateRecovery(): void {
    this.authService
      .activateRecoveryMfa(this.correo, this.otp)
      .subscribe({
        next: ({ message }) => {
          alert(message);
          this.router.navigate(['/auth/login']);
        },
        error: err => {
          alert('Error activando MFA: ' + (err.error?.error || err.message));
        }
      });
  }

  irAlLogin(): void {
    this.router.navigate(['/auth/login']);
  }

}
