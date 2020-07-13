import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
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
