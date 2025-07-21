import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activar-mfa',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './activar-mfa.component.html',
  styleUrls: ['./activar-mfa.component.css']
})
export class ActivarMFAComponent {
  otp: string = '';
  email: string = '';
  qrUrl: string = '';
  secret: string = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.generarQR();
  }

  generarQR(): void {
    this.loading = true;
    const token = localStorage.getItem('access_token');
    this.http.post<any>('http://localhost:3000/mfa/regenerate', {}, {
      headers: {
        Authorization: `Bearer ${token ?? ''}`
      }
    }).subscribe({
      next: (res) => {
        this.qrUrl = res.data.otpAuthUrl;
        this.secret = res.data.secret;
        this.loading = false;
      },
      error: (err) => {
        alert('Error al generar QR: ' + (err.error?.error || err.message));
        this.loading = false;
      }
    });
  }

  activarMFA(): void {
    this.http.post('http://localhost:3000/activar-mfa', {
      otp: this.otp
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`
      }
    }).subscribe({
      next: () => {
        alert('MFA activado correctamente');
        this.router.navigate(['/auth/login']);
      },
      error: err => {
        alert('Error al activar MFA: ' + (err.error?.error || err.message));
      }
    });
  }
}
