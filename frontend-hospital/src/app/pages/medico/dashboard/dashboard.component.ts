import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
//import { SharedModule } from '../../../shared.module'

@Component({
  selector: 'app-medico-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardMedicoComponent implements OnInit {
  permisos: string[] = [];

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.permisos = this.auth.getPermisos();
  }
}

