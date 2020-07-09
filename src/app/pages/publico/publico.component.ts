import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { TicketsService } from '../../services/tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ticket } from '../../interfaces/ticket.interface';

@Component({
	selector: 'app-publico',
	templateUrl: './publico.component.html',
	styleUrls: ['./publico.component.css']
})
export class PublicoComponent implements OnInit {
	dni: number;
	loading = false;
	coming: boolean = false;
	constructor(
		private wsService: WebsocketService,
		public ticketsService: TicketsService,
		private snack: MatSnackBar
	) { }

	ngOnInit(): void {
		this.coming = false;
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('container');
		this.ticketsService.getTickets();
	}

	toggle(chat): void {
		chat.toggle();
	}

	enCamino(): void {
		this.coming = true;
		this.wsService.emit('cliente-en-camino', this.ticketsService.myTicket);
	}
}

