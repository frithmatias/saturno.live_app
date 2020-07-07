import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { TicketResponse, Ticket } from '../../interfaces/ticket.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timer, interval } from 'rxjs';
import { take, takeUntil, switchMap, tap, map } from 'rxjs/operators';
import { IfStmt } from '@angular/compiler';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

const DESK_TIMEOUT = 10; // 60 segundos
const DESK_EXTRATIME = 20; // 120 segundos

@Component({
	selector: 'app-escritorio',
	templateUrl: './escritorio.component.html',
	styleUrls: ['./escritorio.component.css']
})
export class EscritorioComponent implements OnInit {
	waitForClient: boolean = false;
	comingClient: boolean = false;
	pendingTickets: number = 0;
	timerCount: number = DESK_TIMEOUT;
	idDesk: number;
	ticket: Ticket;
	message: string;
	loading = false;
	constructor(
		private activatedRoute: ActivatedRoute,
		public ticketsService: TicketsService,
		private wsService: WebsocketService,
		private snack: MatSnackBar
	) {
		this.activatedRoute.params.subscribe((data) => {
			this.idDesk = data.id;
		});
	}

	ngOnInit(): void {
		this.wsService.escucharTurnos().subscribe(data => {
			this.pendingTickets = Number(data);
		});

		this.ticketsService.getPendingTicket(this.idDesk).subscribe((data: TicketResponse) => {
			if (data.ok) {
				this.ticket = data.ticket;
			} else {
				this.ticket = null;
			}
		});
	}

	atenderTicket(): void {
		this.ticketsService.atenderTicket(this.idDesk, this.wsService.idSocket).subscribe(
			(resp: TicketResponse) => {
				// ahora la solicitud de actualización lo hace el backend desde el servicio REST
				// this.wsService.emit('actualizar-pantalla'); 
				if (!resp.ok) {
				this.waitForClient = false;
				this.ticket = null;
				this.message = resp.msg;
				this.snack.open(resp.msg, 'ACEPTAR', { duration: 2000 });
			} else {

				this.waitForClient = true;
				const encamino$ = this.wsService.escucharEnCamino();
				const timer_timeout$ = interval(1000).pipe(
					map(num => num + 1),
					take(DESK_TIMEOUT));
				const timer_extratime$ = interval(1000).pipe(
					map(num => num + 1),
					take(DESK_EXTRATIME));

				let timeIsOut = false;
				timer_timeout$.pipe(
					tap(num => this.timerCount = DESK_TIMEOUT - num),
					takeUntil(encamino$)
				).subscribe(data => {
					// el observable se completo por TIMEOUT
					if (data >= DESK_TIMEOUT - 1) {
						timeIsOut = true;
					} else {
						timeIsOut = false;
					}
				},
				undefined, 
				()=> {
					if(timeIsOut){ // Se activan las opciones para el operador de atender otro turno 
						this.waitForClient = false;
						this.comingClient = false;
					} else {
						// El observable fue completado por el cliente, en camino, se adiciona tiempo de espera.
						this.waitForClient = true;
						this.comingClient = true;
						timer_extratime$.subscribe(num => this.timerCount = DESK_EXTRATIME - num, undefined, ()=> {
							this.waitForClient = false;
							this.comingClient = false;
						});
					}
				})



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


	atenderInformes(): void{}
	pausarTicket(): void{}
	finalizarTicket(): void{}
}
