import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-asistente',
  templateUrl: './asistente.component.html',
  styleUrls: ['./asistente.component.css']
})
export class AsistenteComponent implements OnInit {
  events: string[] = [];
  opened: boolean;
  unreadMessages: number;

  constructor() { }

  ngOnInit(): void {
  }

  toggle(htmlRef: MatSidenav ): void {
    htmlRef.toggle();
  }
  

}
