import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { TicketResponse, Ticket } from '../../../interfaces/ticket.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs';
import { take, takeUntil, tap, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

const DESK_TIMEOUT = 10; // 60 segundos
const DESK_EXTRATIME = 20; // 120 segundos

@Component({
	selector: 'app-desktop',
	templateUrl: './desktop.component.html',
	styleUrls: ['./desktop.component.css']
})
export class DesktopComponent implements OnInit {
	waitForClient: boolean = false;
	comingClient: boolean = false;
	pendingTickets: number = 0;
	timerCount: number = DESK_TIMEOUT;
	cdDesk: string;
	idDesk: string;
	ticket: Ticket;
	tmWaiting: string = '--:--:--';
	tmAttention: string = '--:--:--';

	message: string;
	loading = false;
	constructor(
		private activatedRoute: ActivatedRoute,
		public ticketsService: TicketsService,
		private userService: UserService,
		private wsService: WebsocketService,
		private snack: MatSnackBar
	) {
		this.activatedRoute.params.subscribe((data) => {
			if(data.id){
				this.cdDesk = data.id;
			}
		});
	}

	ngOnInit(): void {

		// obtengo la cantidad de turnos en cola al generar un nuevo turno.
		this.wsService.escucharTurnos().subscribe(data => {
			this.pendingTickets = Number(data);
		});

		let idDesk = this.userService.desktop._id;

		this.ticketsService.getPendingTicket(idDesk).subscribe((data: TicketResponse) => {
			this.snack.open(data.msg, null, {duration: 5000});
			if (data.ok) {
				this.ticket = data.ticket;
				this.ticketsService.myTicket = data.ticket;
				localStorage.setItem('ticket', JSON.stringify(data.ticket));
			} else {
				this.clearSession();
			}
		});
	}

	atenderTicket(): void {
		
		let cdDesk = this.cdDesk;
		let idDesk = this.userService.desktop._id;
		let idAssistant = this.userService.usuario._id;
		let idSocketDesk = this.wsService.idSocket;

		this.ticketsService.atenderTicket(cdDesk, idDesk, idAssistant, idSocketDesk).subscribe(
			(resp: TicketResponse) => {
				console.log(resp);
			if (!resp.ok) {
				this.waitForClient = false;
				this.message = resp.msg;
				this.clearSession();
			} else {
				this.waitForClient = true;
				this.message = '';

				this.ticket = resp.ticket;
				this.ticketsService.myTicket = resp.ticket;
				localStorage.setItem('ticket', JSON.stringify(resp.ticket));

				// Seteo el tiempo que el cliente estuvo en espera desde que saco su turno hasta que fué atendido
				this.tmWaiting = this.ticketsService.getTimeInterval(resp.ticket.tm_start, resp.ticket.tm_att);

				// DESKTOP WAITING TIMERS
				const encamino$ = this.wsService.escucharEnCamino();
				const timer_timeout$ = interval(1000).pipe(map(num => num + 1),take(DESK_TIMEOUT));
				let timeIsOut = false;
				timer_timeout$.pipe(
					tap(num => this.timerCount = DESK_TIMEOUT - num),
					takeUntil(encamino$)
				).subscribe(
				data => {	// next
					if (data >= DESK_TIMEOUT - 1) {timeIsOut = true;}
				},
				undefined, 	// error
				()=> { 		// complete


					const timerEnd = new Promise((resolve)=>{

						if(timeIsOut){ // Cliente no envió en camino, el operador puede cerrar el turno. 
							this.waitForClient = false;
							this.comingClient = false;
							resolve(); 
						} else {
							// Cliente envió en camino, corre un segundo observable que adiciona tiempo de espera.
							this.waitForClient = true;
							this.comingClient = true;
							const timer_extratime$ = interval(1000).pipe(map(num => num + 1),take(DESK_EXTRATIME));
							timer_extratime$.subscribe(
								num => this.timerCount = DESK_EXTRATIME - num,  // next
								undefined, 	// error
								()=> { 		// complete
									this.waitForClient = false;
									this.comingClient = false;
									resolve();
							});
						}

					});

					timerEnd.then(() => {
						// finalizo el tiempo de espera del cliente, comienza el tiempo del cliente.
						const timer_cliente$ = interval(1000);
						const start_cliente = new Date().getTime();
						const sub_cliente = timer_cliente$.subscribe(() => {
							if (!this.ticket) {
								sub_cliente.unsubscribe();
							} else {
								this.tmAttention = this.ticketsService.getTimeInterval(start_cliente, + new Date());
							}
						});
					});
				});
			}
		});
	}

	atenderInformes(): void {

	}

	devolverTicket(): void {
		this.clearSession();
		this.ticketsService.devolverTicket(this.cdDesk).subscribe((resp: TicketResponse)=>{
			this.message = resp.msg;
		})
	}

	finalizarTicket(): void {
		this.clearSession();
		this.ticketsService.finalizarTicket(this.cdDesk).subscribe((resp: TicketResponse)=>{
			this.message = resp.msg;
		})
	}

	clearSession(){
		this.ticket = null;
		this.ticketsService.myTicket = null;
		if (localStorage.getItem('ticket')) { localStorage.removeItem('ticket'); }
		this.ticketsService.chatMessages = [];
		this.tmWaiting = '--:--:--';
		this.tmAttention = '--:--:--';
	}

}
