import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';

// PrimeNG
import { PanelModule }     from 'primeng/panel';
import { TableModule }     from 'primeng/table';
import { ButtonModule }    from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule }   from 'primeng/message';

import { AuthService }     from '../../../services/auth.service';
import { ConsultaService } from '../../../services/consulta.service';
import { RecetaService }   from '../../../services/receta.service';
import { Consulta, NewConsulta } from '../../../services/consulta.service';

@Component({
  standalone: true,
  selector: 'app-dashboard-paciente',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    MessageModule
  ]
})
export class DashboardPacienteComponent implements OnInit {
  private auth       = inject(AuthService);
  private consultaSv = inject(ConsultaService);
  private recetaSv   = inject(RecetaService);

  permisos: string[] = [];
  consultas: Consulta[] = [];
  recetas: any[] = [];

  // Para creación de cita
  nuevaCita: NewConsulta = {
    id_paciente: 0,
    id_medico:      undefined as any,
    id_consultorio: undefined as any,
    id_horario:     undefined as any
  };
  resultadoCita: string | null = null;

  // Controles UI
  showConsultas = false;
  showCitaForm  = false;
  showRecetas   = false;

  ngOnInit(): void {
    this.permisos = this.auth.getPermisos();
    const id = this.auth.getUserId();
    if (id !== null) {
      this.nuevaCita.id_paciente = id;
    }
  }

  verConsultas() {
    const id = this.auth.getUserId();
    if (id === null) return;

    this.consultaSv.obtenerConsultasPaciente(id)
      .subscribe({
        next: data => {
          this.consultas     = data;
          this.showConsultas = true;
          this.showCitaForm  = false;
          this.showRecetas   = false;
        },
        error: err => console.error('Error al cargar consultas', err)
      });
  }

  mostrarFormularioCita() {
    this.showCitaForm  = true;
    this.showConsultas = false;
    this.showRecetas   = false;
    this.resultadoCita = null;
  }

  crearCita() {
    const { id_medico, id_consultorio, id_horario } = this.nuevaCita;
    if (!id_medico || !id_consultorio || !id_horario) {
      this.resultadoCita = 'Completa todos los campos';
      return;
    }

    this.consultaSv.crearConsulta(this.nuevaCita)
      .subscribe({
        next: () => {
          this.resultadoCita = 'Cita creada correctamente';
          this.verConsultas();
        },
        error: err => {
          console.error('Error al crear cita', err);
          this.resultadoCita = 'Error al crear cita';
        }
      });
  }

  verRecetas() {
    const id = this.auth.getUserId();
    if (id === null) return;

    this.recetaSv.obtenerRecetasPaciente(id)
      .subscribe({
        next: data => {
          this.recetas       = data;
          this.showRecetas   = true;
          this.showConsultas = false;
          this.showCitaForm  = false;
        },
        error: err => console.error('Error al cargar recetas', err)
      });
  }
}
