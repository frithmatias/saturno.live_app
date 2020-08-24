import { Component, OnInit } from '@angular/core';
import { TicketsService } from 'src/app/services/tickets.service';
import { Ticket } from 'src/app/interfaces/ticket.interface';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  tickets: Ticket[] = [];

  constructor(private ticketsService: TicketsService) { }

  ngOnInit(): void {
    this.readTickets();
  }

  readTickets(): void {
    this.ticketsService.getTickets().then((tickets: Ticket[]) => {
      this.tickets = tickets;
    })
  }


}
