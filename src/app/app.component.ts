import { Component } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  opened: boolean;
  unreadMessages: number;
  constructor(private router: Router) {

    if (localStorage.getItem('ticket') || localStorage.getItem('company')) {
      this.router.navigate(['/publico']);
    } else if (localStorage.getItem('user')) {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user.id_role === 'ASSISTANT_ROLE') {
        this.router.navigate(['/asistente']);
      } else if (user.id_role === 'USER_ROLE') {
        this.router.navigate(['/user']);
      }
    } else {
      this.router.navigate(['/home'])
    }



  }
  toggle(htmlRef: MatSidenav): void {
    htmlRef.toggle();
  }
}

