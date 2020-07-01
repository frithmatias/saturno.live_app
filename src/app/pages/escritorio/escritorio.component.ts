import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { TicketResponse } from '../../interfaces/ticket.interface';

@Component({
	selector: 'app-escritorio',
	templateUrl: './escritorio.component.html',
	styleUrls: ['./escritorio.component.css']
})
export class EscritorioComponent implements OnInit {
	idDesk: number;
	idTicket: number;
	message: string;
	loading = false;
	constructor(
		private activatedRoute: ActivatedRoute,
		private ticketsService: TicketsService,
		private wsService: WebsocketService
	) {
		this.activatedRoute.params.subscribe((data) => {
			this.idDesk = data.id;
		});
	}

	ngOnInit(): void {
		this.ticketsService.getPendingTicket(this.idDesk).subscribe((data: TicketResponse) => {
			if (data.ok) {
				this.idTicket = data.ticket.id_ticket;
			} else {
				this.idTicket = null;
			}
		});
	}

	atenderTicket(): void {
		this.ticketsService.atenderTicket(this.idDesk).subscribe((resp: TicketResponse) => {
			this.wsService.emit('actualizar-pantalla');
			if (!resp.ok) {
				this.message = resp.msg;
			} else {
				resp.msg = 'llamando un nuevo ticket';
				this.idTicket = resp.ticket.id_ticket;
				this.message = '';
			}
		});
	}
}
