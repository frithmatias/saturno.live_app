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

    if (localStorage.getItem('ticket')) {
      this.router.navigate(['/publico']);
    } else {
      if (localStorage.getItem('user')) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.router.navigate(['/publico', user.id_company]);
      }
    }



  }
  toggle(htmlRef: MatSidenav): void {
    htmlRef.toggle();
  }
}

