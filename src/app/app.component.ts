import { Component } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  events: string[] = [];
  opened: boolean;
  title = 'colas';

  toggle(htmlRef: MatSidenav ): void {
    htmlRef.toggle();
  }
}
