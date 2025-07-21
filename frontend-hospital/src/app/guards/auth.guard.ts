import { Injectable } from '@angular/core';

import {
  CanActivateFn,   // Interfaz para proteger rutas (función guard)
  Router,
   ActivatedRouteSnapshot
} 
from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode'; 

// Este guard se usa para proteger rutas según si el usuario está autenticado y tiene permisos
export const AuthGuard: CanActivateFn = (route, state) => {
  // Inyectamos el servicio de autenticación
  const auth = inject(AuthService); 
  // Inyectamos el Router para redirecciones
  const router = inject(Router);   

  const token = auth.getAccessToken(); 

  // Si no hay token, se redirige al login
  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }
  
  try {

    // Decodificamos el JWT para obtener los permisos
    const decoded: any = jwtDecode(token);

    const permisos: string[] = decoded.permisos || []; 

    // Obtenemos los permisos requeridos desde la ruta protegida
    const permisosRequeridos = route.data?.['permisos'] as string[] || [];

    // Validamos si el usuario tiene todos los permisos requeridos
    const tienePermisos = permisosRequeridos.every(p => permisos.includes(p));

    // Si no tiene permisos necesarios, se redirige al login
    if (!tienePermisos) {
      router.navigate(['/auth/login']);
      return false;
    }

    return true;

  } catch (e) {

    // Si ocurre un error (por ejemplo, el token está mal formado), se elimina y redirige
    auth.logout();
    router.navigate(['/auth/login']);
    return false;
  }
};
