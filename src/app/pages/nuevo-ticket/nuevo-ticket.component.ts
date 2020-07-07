import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { HttpClient } from '@angular/common/http';
import { TicketsService } from 'src/app/services/tickets.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Ticket, TicketResponse } from 'src/app/interfaces/ticket.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-nuevo-ticket',
	templateUrl: './nuevo-ticket.component.html',
	styleUrls: ['./nuevo-ticket.component.css']
})
export class NuevoTicketComponent implements OnInit {
	loading: boolean;
	ticketNum: number;
	hasTicket = false;
	constructor(
		private wsService: WebsocketService,
		private ticketsService: TicketsService,
		private router: Router,
		private snak: MatSnackBar
	) { }

	ngOnInit(): void {
	}

	nuevoTicket(): void {
		if (!localStorage.getItem('turno')) {
			this.loading = true;
			this.ticketsService.nuevoTicket(this.wsService.idSocket).subscribe(
				(data: TicketResponse) => {
				console.log(data);
				if (data.ok) {
					localStorage.setItem('turno', JSON.stringify(data.ticket));
					this.loading = false;
					this.router.navigate(['/publico']);
				}
			},
			undefined,
			() => console.log('COMPLETADO!!!!!!')
			);
		} else {
			console.log('usted ya tiene un número');
			this.snak.open('Usted ya tiene un turno!', null, { duration: 2000 });
			this.router.navigate(['/publico']);
		}
	}


	pantallaPublica(): void {
		this.router.navigate(['/publico']);
	}
}
