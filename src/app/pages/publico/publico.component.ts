import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-publico',
  templateUrl: './publico.component.html',
  styleUrls: ['./publico.component.css']
})
export class PublicoComponent implements OnInit {
  opened: boolean;
  unreadMessages: number;
  constructor() { }

  ngOnInit(): void {
  }
  
  toggle(htmlRef: MatSidenav ): void {
    htmlRef.toggle();
  }
}
