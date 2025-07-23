// not-authorized.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
//import { SharedModule } from '../../shared.module'

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  imports:[],
  styleUrls: ['./not-authorized.component.scss'],
})
export class NotAuthorizedComponent {
  constructor(private router: Router) {}

  volver() {
    this.router.navigate(['/']);
  }
}
