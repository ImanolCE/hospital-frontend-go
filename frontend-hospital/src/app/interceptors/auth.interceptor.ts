
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} 

from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, throwError, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.endsWith('/login') ||
      req.url.endsWith('/refresh') ||
      req.url.endsWith('/usuarios')) {
      return next.handle(req);
  }

    // 1) se clona la request añadiendo el Authorization si tenemos token

    const token = this.auth.getAccessToken();
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    // 2) enviamos y capturamos errores
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        
        // Si recibimos 401 y no estamos refrescando, intentamos refresh

        if (err.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          return this.auth.refreshToken().pipe(
            switchMap(() => {
              this.isRefreshing = false;

              // Reintenta la petición original con nuevo token
              const newToken = this.auth.getAccessToken();
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next.handle(retryReq);
            }),
            catchError(innerErr => {
              this.isRefreshing = false;
              this.auth.logout();
              return throwError(() => innerErr);
            })
          );
        }
        // Para otros errores o si ya intentamos refresh, dejamos pasar el error
        return throwError(() => err);
      })
    );
  }
}
