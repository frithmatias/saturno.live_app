import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { TicketsService } from '../../services/tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-publico',
	templateUrl: './publico.component.html',
	styleUrls: ['./publico.component.css']
})
export class PublicoComponent implements OnInit {
	dni: number;
	loading = false;
	constructor(
		private wsService: WebsocketService,
		public ticketsService: TicketsService,
		private snack: MatSnackBar
	) { }

	ngOnInit(): void {
		localStorage.setItem('role', JSON.stringify({role: 2}));
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('container');
		this.ticketsService.getTickets();
	}

	extend(): void {
		this.wsService.emit('extender-tiempo-atencion', this.ticketsService.myTicket);
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

