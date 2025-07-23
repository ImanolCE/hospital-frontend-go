import { CommonModule } from '@angular/common';
import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { InputTextModule } from "primeng/inputtext"
import { ButtonModule } from "primeng/button"
import { RouterModule } from "@angular/router"
import { CheckboxModule } from "primeng/checkbox"
import { CardModule } from "primeng/card"
import { PasswordModule } from "primeng/password"
import { ToastModule } from "primeng/toast"
import { ProgressSpinnerModule } from "primeng/progressspinner"
import { MessageService } from "primeng/api"
import { Router } from "@angular/router"
import { AuthService } from "../../../services/auth.service"
import logoUrl from './logo.png';

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    RouterModule,
    PasswordModule,
    ToastModule,
    ProgressSpinnerModule,
    CommonModule
  ],
  providers: [MessageService],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loading = false
  remember = false
  email = ""
  password = ""
  otp = ""
   logo = new URL('./logo.png', import.meta.url).href;


  // Map de permisos mínimos por rol
  private requiredPerms: { [role: string]: string[] } = {
    paciente: ["ver_dashboard", "ver_consultas"],
    enfermera: ["ver_dashboard", "ver_usuarios", "ver_consultas"],
    medico: ["ver_dashboard", "ver_consultas", "crear_consultas", "ver_usuarios", "actualizar_consultas"],
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  onLogin(): void {
    if (!this.email || !this.password || !this.otp) {
      this.messageService.add({
        severity: "warn",
        summary: "Campos Requeridos",
        detail: "Por favor complete todos los campos",
      })
      return
    }

    this.loading = true

    this.auth.login({}, this.email, this.password, this.otp).subscribe({
      next: (tokens) => {
        this.messageService.add({
          severity: "success",
          summary: "Login Exitoso",
          detail: "Bienvenido al sistema médico",
        })

        console.log("Token:", tokens.access_token)
        console.log("Refresh:", tokens.refresh_token)

        const permisos = this.auth.getPermisos()
        const rol = this.auth.getUserRole() || ""

        // comprueba permisos mínimos según rol
        const reqs =
          {
            paciente: ["ver_dashboard", "ver_consultas"],
            enfermera: ["ver_dashboard", "ver_usuarios", "ver_consultas"],
            medico: ["ver_dashboard", "ver_consultas", "crear_consultas", "ver_usuarios", "actualizar_consultas"],
          }[rol] || []

        if (!reqs.every((p) => permisos.includes(p))) {
          this.messageService.add({
            severity: "error",
            summary: "Permisos Insuficientes",
            detail: `Tu cuenta como ${rol} no tiene los permisos necesarios`,
          })
          this.loading = false
          return
        }

        this.messageService.add({
          severity: "info",
          summary: `Bienvenido ${rol || "usuario"}`,
          detail: `Permisos: ${permisos.join(", ")}`,
        })

        // Navegar después de un breve delay para mostrar el mensaje
        setTimeout(() => {
          switch (rol) {
            case "paciente":
              this.router.navigate(["/paciente"])
              break
            case "enfermera":
              this.router.navigate(["/enfermera"])
              break
            case "medico":
              this.router.navigate(["/medico"])
              break
            default:
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Rol desconocido",
              })
              break
          }
          this.loading = false
        }, 1500)
      },
      error: (err) => {
        console.error("Login fallido", err)
        this.messageService.add({
          severity: "error",
          summary: "Error de Autenticación",
          detail: "Credenciales incorrectas o error del servidor",
        })
        this.loading = false
      },
    })
  }
}
