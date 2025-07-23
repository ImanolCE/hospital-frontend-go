import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1) ¿Está autenticado?
  if (!auth.getAccessToken()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // 2) ¿Qué permisos exige esta ruta?
  //    Defínelos como: data: { permisos: ['ver_consultas'] }
  const permisosRequeridos = route.data?.['permisos'] as string[] || [];

  // 3) Si hay permisos, comprobamos que el usuario los tenga
  if (permisosRequeridos.length) {
    const tienePermisos = permisosRequeridos.every(p => auth.hasPermiso(p));
    if (!tienePermisos) {
      // Redirigimos a "Not Authorized" si falla permiso
      router.navigate(['/not-authorized']);
      return false;
    }
  }

  // Todo OK
  return true;
};
