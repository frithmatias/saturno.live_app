import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { TicketsService } from '../../../services/tickets.service';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Ticket } from '../../../interfaces/ticket.interface';
import { Router } from '@angular/router';
import { TicketResponse } from 'src/app/interfaces/ticket.interface';
import { UserService } from 'src/app/services/user.service';

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
		private userService: UserService,
		private snack: MatSnackBar,
		private router: Router
	) { }

	ngOnInit(): void {

		this.coming = false;
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('container');

		if (!this.userService.usuario && !this.ticketsService.companyData) {
			this.ticketsService.getTickets();
			this.router.navigate(['/publico']);
			this.snack.open('Por favor ingrese una empresa primero!', null, { duration: 5000 });
		}
	}

	toggle(chat): void {
		chat.toggle();
	}

	enCamino(): void {
		this.coming = true;
		let idSocketDesk = this.ticketsService.myTicket.id_socket_desk;
		this.wsService.emit('cliente-en-camino', idSocketDesk);
	}

	cancelTicket(): void {
		this.snack.open('Desea cancelar el turno?', 'SI, CANCELAR', { duration: 5000 }).afterDismissed().subscribe((data: MatSnackBarDismiss) => {
			if (data.dismissedByAction) {
				this.ticketsService.cancelTicket(this.ticketsService.myTicket._id).subscribe((data: TicketResponse) => {
					if (data.ok) {
						this.snack.open(data.msg, 'ACEPTAR', { duration: 5000 });
						this.ticketsService.clearPublicSession();
						this.router.navigate(['/publico']);
					}
				});
			}
		});
	}
}

