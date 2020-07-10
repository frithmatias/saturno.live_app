import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  events: string[] = [];
  opened: boolean;
  constructor(private router: Router) { }
  
  ngOnInit(): void {
  }

  entrar(numero: number): void {
    if (!numero) {
      return;
    }
    this.router.navigate(['/asistente/escritorio', numero]);
  }
  
}
