import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { TicketsService } from '../../../services/tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ticket } from '../../../interfaces/ticket.interface';
import { Router } from '@angular/router';
import { TicketResponse } from 'src/app/interfaces/ticket.interface';

@Component({
	selector: 'app-pantalla',
	templateUrl: './pantalla.component.html',
	styleUrls: ['./pantalla.component.css']
})
export class PantallaComponent implements OnInit {
	dni: number;
	loading = false;
	coming: boolean = false;
	constructor(
		private wsService: WebsocketService,
		public ticketsService: TicketsService,
		private snack: MatSnackBar,
		private router: Router
	) { }

	ngOnInit(): void {
		this.coming = false;
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('container');

		if(this.ticketsService.companyData){
			// this.ticketsService.getTickets();
		} else {
			this.router.navigate(['/publico']);
			this.snack.open('Por favor ingrese una empresa primero!', null, { duration: 5000});
		}
	}

	toggle(chat): void {
		chat.toggle();
	}

	enCamino(): void {
		this.coming = true;
		this.wsService.emit('cliente-en-camino', this.ticketsService.myTicket);
	}

	cancelTicket(): void {
		this.ticketsService.cancelTicket(this.ticketsService.myTicket._id).subscribe((data: TicketResponse) => {
			if(data.ok){
				this.snack.open(data.msg, 'ACEPTAR', {duration: 5000});
				this.ticketsService.clearPublicSession();
			}
		})
	}
}

