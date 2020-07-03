import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { TicketResponse, Ticket } from '../../interfaces/ticket.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-escritorio',
	templateUrl: './escritorio.component.html',
	styleUrls: ['./escritorio.component.css']
})
export class EscritorioComponent implements OnInit {
	idDesk: number;
	ticket: Ticket;
	message: string;
	loading = false;
	constructor(
		private activatedRoute: ActivatedRoute,
		private ticketsService: TicketsService,
		private wsService: WebsocketService,
		private snack: MatSnackBar
	) {
		this.activatedRoute.params.subscribe((data) => {
			this.idDesk = data.id;
		});
	}

	ngOnInit(): void {
		localStorage.setItem('role', JSON.stringify({role: 1}));
		this.ticketsService.getPendingTicket(this.idDesk).subscribe((data: TicketResponse) => {
			if (data.ok) {
				this.ticket = data.ticket;
			} else {
				this.ticket = null;
			}
		});
	}

	atenderTicket(): void {
		this.ticketsService.atenderTicket(this.idDesk, this.wsService.idSocket).subscribe((resp: TicketResponse) => {
			console.log(resp);


			this.wsService.emit('actualizar-pantalla');
			if (!resp.ok) {
				this.ticket = null;
				this.message = resp.msg;
				this.snack.open(resp.msg, 'ACEPTAR', { duration: 2000 });
			} else {
				this.ticket = resp.ticket;
				this.message = '';
			}
		});
	}


	sendMessage(e: HTMLInputElement): void {
		if (!this.wsService.idSocket) {
			this.snack.open('Se perdió la conexión con el escritorio.', 'ACEPTAR', { duration: 5000 });
			return;
		}

		if (e.value.length > 0) {
			this.wsService.emit('mensaje-privado', { mensaje: e.value });
			e.value = '';
		}
	}
}
