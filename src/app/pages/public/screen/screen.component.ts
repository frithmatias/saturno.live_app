import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';
import { TicketsService } from '../../../services/tickets.service';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TicketResponse } from '../../../interfaces/ticket.interface';
import { UserService } from '../../../services/user.service';

@Component({
	selector: 'app-screen',
	templateUrl: './screen.component.html',
	styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit {
	dni: number;
	loading = false;
	coming: boolean = false;
	publicMode: boolean = false;
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

		if (!this.userService.user) {
			
			if (!this.ticketsService.companyData) {
				this.router.navigate(['/public']);
				this.snack.open('Por favor ingrese una empresa primero!', null, { duration: 5000 });
			}
			
			this.publicMode = true;
		}
		
		this.ticketsService.getTickets();
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
		this.snack.open('Desea cancelar el turno?', 'SI, CANCELAR', { duration: 10000 }).afterDismissed().subscribe((data: MatSnackBarDismiss) => {
			if (data.dismissedByAction) {
				this.ticketsService.cancelTicket(this.ticketsService.myTicket._id).subscribe((data: TicketResponse) => {
					if (data.ok) {
						this.snack.open(data.msg, 'ACEPTAR', { duration: 2000 });
						this.ticketsService.clearPublicSession();
						this.router.navigate(['/public']);
					}
				});
			}
		});
	}
}

