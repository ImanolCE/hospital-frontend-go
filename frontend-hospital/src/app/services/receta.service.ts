// src/app/services/receta.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { map, Observable }    from 'rxjs';
import { AuthService }        from './auth.service';

interface WrappedRes<T> { data: T[]; intCode: string; statusCode: number; }
export interface Receta {
  id_receta: number;
  id_consulta: number;
  fecha: string;
  medicamento: string;
  dosis: string;
}

@Injectable({ providedIn: 'root' })
export class RecetaService {
  private apiUrl = 'http://localhost:3000';
  private http    = inject(HttpClient);
  private auth    = inject(AuthService);

   obtenerRecetasPaciente(idPaciente: number): Observable<any[]> {
    return this.http
      .get<{ data: any[] }>(`${this.apiUrl}/paciente/${idPaciente}`)
      .pipe(map(res => res.data));
  }
}
