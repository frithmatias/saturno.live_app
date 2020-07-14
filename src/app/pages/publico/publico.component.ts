import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-publico',
  templateUrl: './publico.component.html',
  styleUrls: ['./publico.component.css']
})
export class PublicoComponent implements OnInit {
  opened: boolean;
  unreadMessages: number;
  constructor(private ticketsService: TicketsService) { 
    this.ticketsService.userPreset = true;
  }
  ngOnInit(): void { }
    toggle(htmlRef: MatSidenav ): void {
    htmlRef.toggle();
  }
}
