import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';
import { TicketsService } from '../../../services/tickets.service';
import { Router  } from '@angular/router';
import { TicketResponse } from '../../../interfaces/ticket.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-turnos',
	templateUrl: './turnos.component.html',
	styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {
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
				if (data.ok) {
					localStorage.setItem('turno', JSON.stringify(data.ticket));
					this.loading = false;
					this.router.navigate(['/publico/pantalla']);
				}
			},
			undefined,
			() => {}
			);
		} else {
			this.snak.open('Usted ya tiene un turno!', null, { duration: 2000 });
			this.router.navigate(['/publico/pantalla']);
		}
	}


	pantallaPublica(): void {
		this.router.navigate(['/publico/pantalla']);
	}
}
