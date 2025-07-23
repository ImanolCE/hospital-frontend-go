import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

export interface Consulta {
  id: number;
  id_paciente: number;
  id_medico: number;
  id_consultorio: number;
  id_horario: number;
  diagnostico: string;
  costo: number;
  tipo: string;
}

export interface NewConsulta {
  id_paciente: number;
  id_medico: number;
  id_consultorio: number;
  id_horario: number;
  diagnostico?: string;
  costo?: number;
  tipo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private apiUrl = 'http://localhost:3000/consultas';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  /** Construye las cabeceras con el Bearer token */
  private get headers(): HttpHeaders {
    const token = this.auth.getAccessToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  /** Obtiene el historial de consultas de un paciente */
  obtenerConsultasPaciente(idPaciente: number): Observable<Consulta[]> {
    return this.http
      .get<{ data: Consulta[] }>(
        `${this.apiUrl}/paciente/${idPaciente}`,
        { headers: this.headers }
      )
      .pipe(map(res => res.data));
  }

  /** Crea una nueva consulta (cita) */
  crearConsulta(payload: NewConsulta): Observable<Consulta> {
    return this.http
      .post<{ data: Consulta }>(
        this.apiUrl,
        payload,
        { headers: this.headers }
      )
      .pipe(map(res => res.data));
  }
}
