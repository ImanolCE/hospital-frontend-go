// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

// Interfaces para tipar las respuestas del backend
interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface RegisterResponse {
  message: string;
  otpauth_url: string;
}

interface WrappedRes<T> {
  data: T[];
  intCode: string;
  statusCode: number;
}

interface JwtPayload {
  sub: string;
  email: string;
  tipo_usuario: string;
  permisos: string[];
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    [x: string]: any;
  private apiUrl = 'http://localhost:3000';  
  private tokenKey = 'access_token';
  private refreshKey = 'refresh_token';
  private _profile = new BehaviorSubject<JwtPayload | null>(null);
 public profile$ = this._profile.asObservable();

  constructor(private http: HttpClient, private router: Router) {
      const token = this.getAccessToken();
      if (token) this.setDecodedProfile(token);

  }

  /** Cabeceras con JWT */
  private authHeaders(): { [header: string]: string } {
    const token = localStorage.getItem(this.tokenKey) ?? '';
    return { Authorization: `Bearer ${token}` };
  }

  /** Manejo central de errores HTTP */
  private handleError(error: HttpErrorResponse) {
    console.error('AuthService error', error);
    return throwError(() => error);
  }

  private setDecodedProfile(token: string): void {
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.error('Token JWT inválido');
    return;
  }
  try {
    const payload = JSON.parse(atob(parts[1]));
    this._profile.next(payload);                            // emitir el profile
    localStorage.setItem('userId', payload.user_id.toString()); // ← usa user_id, no id
  } catch (e) {
    console.error('Error al decodificar el token JWT', e);
  }
}



  /** LOGIN: guarda access + refresh token en localStorage */
  login(user:any, email: string, password: string, otp: string): Observable<LoginResponse> {
    return this.http
      .post<WrappedRes<LoginResponse>>(
        `${this.apiUrl}/login`,
        { correo: email, password, otp }
      )
      .pipe(
        tap(res => {
          const { access_token, refresh_token } = res.data[0];
          localStorage.setItem(this.tokenKey, access_token);
          localStorage.setItem(this.refreshKey, refresh_token);
           this.setDecodedProfile(access_token);
        }),
        map(res => res.data[0]),
        catchError(this.handleError)
      );
  }

  /** REGISTER: crea usuario y devuelve otpauth_url para MFA inicial */
  register(userData: {
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    tipo_usuario: string;
  }): Observable<RegisterResponse> {
    return this.http
      .post<WrappedRes<RegisterResponse>>(
        `${this.apiUrl}/usuarios`,
        userData
      )
      .pipe(
        map(res => res.data[0]),
        catchError(this.handleError)
      );
  }

  /** REFRESH TOKEN: obtiene nuevos tokens y los guarda */
  refreshToken(): Observable<LoginResponse> {
    const rt = localStorage.getItem(this.refreshKey);
    return this.http
      .post<WrappedRes<LoginResponse>>(
        `${this.apiUrl}/refresh`,
        { refresh_token: rt }
      )
      .pipe(
        tap(res => {
          const { access_token, refresh_token } = res.data[0];
          localStorage.setItem(this.tokenKey, access_token);
          localStorage.setItem(this.refreshKey, refresh_token); 
          this.setDecodedProfile(access_token);
        }),
        map(res => res.data[0]),
        catchError(this.handleError)
      );
  }

  /** LOGOUT: borra tokens y lleva al login */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
     this._profile.next(null);
    this.router.navigate(['/auth/login']);
  }

  /** Acceso directo al access token */
  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** Decodifica payload del JWT */
  getPayload(): any | null {
    const token = this.getAccessToken();
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
      const payloadJson = atob(parts[1]);
      return JSON.parse(payloadJson);
    } catch {
      return null;
    }
  }

  /** Extrae ID de usuario del payload */
 getUserId(): number | null {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id;
  } catch (e) {
    return null;
  }
}

  /** Extrae rol de usuario del payload */
  getUserRole(): string | null {
    const payload = this.getPayload();
    return payload?.tipo_usuario ?? payload?.rol ?? null;
  }

  /** Extrae permisos del payload */
  getPermisos(): string[] {
    const payload = this.getPayload();
    return Array.isArray(payload?.permisos) ? payload.permisos : [];
  }

  /** Comprueba si tiene un permiso específico */
  hasPermiso(nombre: string): boolean {
    return this.getPermisos().includes(nombre);
  }

  addAuthHeader(): string {
  return 'Bearer ' + localStorage.getItem('access_token') || '';
}


  // ─── MFA PÚBLICO: RECOVERY ─────────────────────────────────────────────────────

  /** Inicia MFA público con correo+password → genera QR/secret */
  recoverMfa(correo: string, password: string): Observable<{ otpAuthUrl: string; secret: string }> {
  return this.http
    .post<{ data: { otpAuthUrl: string; secret: string }; intCode: string; statusCode: number }>(
      `${this.apiUrl}/mfa/recovery`,
      { correo, password }
    )
    .pipe(
      map(res => res.data),       // ← aquí ya no accedemos a [0]
      catchError(this.handleError)
    );
}


  /** Activa MFA de recovery sin JWT, usando correo+OTP */
  activateRecoveryMfa(correo: string, otp: string): Observable<{ message: string }> {
  return this.http
    .post<WrappedRes<{ message: string }>>(
      `${this.apiUrl}/mfa/recovery/activate`,
      { correo, otp }
    )
    .pipe(
      map(res => res.data[0]),  // data es un array con un único objeto
      catchError(this.handleError)
    );
}

  // ─── MFA PROTEGIDO (JWT) ──────────────────────────────────────────────────────

  /** Regenera QR/secret para usuario logueado */
  regenerateMfa(): Observable<{ otpAuthUrl: string; secret: string }> {
    return this.http
      .post<WrappedRes<{ otpAuthUrl: string; secret: string }>>(
        `${this.apiUrl}/mfa/regenerate`,
        {},
        { headers: this.authHeaders() }
      )
      .pipe(
        map(res => res.data[0]),
        catchError(this.handleError)
      );
  }

  /** Activa MFA para usuario logueado (requiere JWT + OTP) */
  activateMfa(otp: string): Observable<void> {
    return this.http
      .post<WrappedRes<void>>(
        `${this.apiUrl}/mfa/activar`,
        { otp },
        { headers: this.authHeaders() }
      )
      .pipe(
        map(() => {}),
        catchError(this.handleError)
      );
  }
}
