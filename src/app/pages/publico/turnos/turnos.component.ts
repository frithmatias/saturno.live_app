import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';
import { TicketsService } from '../../../services/tickets.service';
import { Router } from '@angular/router';
import { TicketResponse } from '../../../interfaces/ticket.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IfStmt } from '@angular/compiler';

@Component({
	selector: 'app-turnos',
	templateUrl: './turnos.component.html',
	styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {
	companyData: any;
	loading: boolean;
	ticketNum: number;
	hasTicket = false;
	constructor(
		private wsService: WebsocketService,
		public ticketsService: TicketsService,
		private router: Router,
		private snack: MatSnackBar
	) { }

	ngOnInit(): void {
		if (this.ticketsService.myTicket) {
			this.snack.open('Usted ya tiene un turno!', null, { duration: 5000 });
			this.router.navigate(['/publico/pantalla']);
		} else {
			if (!this.ticketsService.companyData) {
				this.snack.open('Por favor ingrese una empresa primero!', null, { duration: 5000 });
				this.router.navigate(['/publico']);
			}
		}
	}

	nuevoTicket(tipo_turno: string): void {
		this.loading = true;
		this.ticketsService.nuevoTicket(this.wsService.idSocket, tipo_turno, this.ticketsService.companyData._id).subscribe(
			(data: TicketResponse) => {
				if (data.ok) {
					localStorage.setItem('turno', JSON.stringify(data.ticket));
					this.ticketsService.myTicket = data.ticket;
					this.loading = false;
					this.router.navigate(['/publico/pantalla']);
				}
			}
		);
	}


}
