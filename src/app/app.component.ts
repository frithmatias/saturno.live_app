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

    
    if (localStorage.getItem('turno')) {
      this.router.navigate(['/publico/pantalla']);
    } else {
      if (localStorage.getItem('company')) {
        let company = JSON.parse(localStorage.getItem('company'));
        this.router.navigate(['/publico', company.empresa]);
      }
    }



  }
  toggle(htmlRef: MatSidenav): void {
    htmlRef.toggle();
  }
}

