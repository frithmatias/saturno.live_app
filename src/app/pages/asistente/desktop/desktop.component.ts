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
export class DesktopComponent implements OnInit, OnDestroy {
	waitForClient: boolean = false;
	comingClient: boolean = false;
	pendingTickets: number = 0;
	timerCount: number = DESK_TIMEOUT;
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
			this.idDesk = data.id;
		});
	}

	ngOnInit(): void {

		// obtengo la cantidad de turnos en cola al generar un nuevo turno.
		this.wsService.escucharTurnos().subscribe(data => {
			this.pendingTickets = Number(data);
		});

		this.ticketsService.getPendingTicket(this.userService.usuario.id_company, this.idDesk).subscribe((data: TicketResponse) => {
			this.snack.open(data.msg, null, {duration: 5000});
			if (data.ok) {
				this.ticket = data.ticket;
			} else {
				this.ticket = null;
			}
		});
	}

	atenderTicket(): void {
		
		this.clearSession();
		let idDesk = this.idDesk;
		let idAssistant = this.userService.usuario._id;
		let idSocketDesk = this.wsService.idSocket;

		this.ticketsService.atenderTicket(idDesk, idAssistant, idSocketDesk).subscribe(
			(resp: TicketResponse) => {
			if (!resp.ok) {
				this.waitForClient = false;
				this.message = resp.msg;
				this.snack.open(resp.msg, 'ACEPTAR', { duration: 2000 });
			} else {
				this.waitForClient = true;
				this.message = '';
				this.ticket = resp.ticket;

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

	atenderInformes(): void {

	}

	devolverTicket(): void {
		this.clearSession();
		this.ticketsService.devolverTicket(this.idDesk).subscribe((resp: TicketResponse)=>{
			this.message = resp.msg;
		})
	}

	finalizarTicket(): void {
		this.clearSession();
		this.ticketsService.finalizarTicket(this.idDesk).subscribe((resp: TicketResponse)=>{
			this.message = resp.msg;
		})
	}

	clearSession(){
		this.ticketsService.chatMessages = [];
		this.ticket = null;
		this.tmWaiting = '--:--:--';
		this.tmAttention = '--:--:--';
	}

	ngOnDestroy(){
		console.log('finalizando escritorio');
		let idCompany = this.userService.usuario.id_company;
		let idAssistant = this.userService.usuario._id;
	
		this.userService.releaseDesktop(idCompany, this.idDesk, idAssistant).subscribe(data => {
		  console.log(data);
		})

	}
}
