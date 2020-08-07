import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { TicketResponse, Ticket } from '../../../interfaces/ticket.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, Subscriber, Subscription } from 'rxjs';
import { take, takeUntil, tap, map, takeWhile } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { DesktopResponse } from 'src/app/interfaces/desktop.interface';

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

	pendingTicketsCount: number = 0;
	pendingTicketsBySkill: any[] = [];

	timerCount: number = DESK_TIMEOUT;
	cdDesk: string;
	idDesk: string;
	tmWaiting: string = '--:--:--';
	tmAttention: string = '--:--:--';
	tmRun: Subscription;
	message: string;
	

	constructor(
		public ticketsService: TicketsService,
		private userService: UserService,
		private wsService: WebsocketService,
		private snack: MatSnackBar,
		private router: Router
	) { }

	ngOnInit() {

		if (this.userService.desktop?.cd_desktop) {
			this.cdDesk = this.userService.desktop.cd_desktop;
		} else {
			this.snack.open('No tiene un escritorio asignado', null, { duration: 2000 })
			this.router.navigate(['/assistant/home']);
		}

		this.getTickets();
		// obtengo la cantidad de tickets en cola al generar un nuevo turno.
		this.wsService.escucharTurnos().subscribe(data => {
			this.getTickets();
		});

	}

	async getTickets() {
		// traigo todos los tickets
		await this.ticketsService.getTickets().then(tickets => {
			// verifico si existe un ticket pendiente
			const pending = tickets.filter(ticket => ticket.cd_desk === this.cdDesk && ticket.tm_end === null)[0]

			if (pending) {
				this.message = 'Existe un ticket pendiente de resolución'
				this.snack.open('Existe un ticket pendiente', null, { duration: 2000 });
				// this.ticketsService.myTicket = pending;
				localStorage.setItem('ticket', JSON.stringify(pending));
			}

			const waiting = tickets.filter(ticket => ticket.tm_end === null);
			this.pendingTicketsCount = waiting.length;

			if (waiting.length > 0) { this.message = `Hay ${waiting.length} tickets en espera`; }

			const skills = this.userService.user.id_skills;

			this.pendingTicketsBySkill = [];

			for (let skill of skills) {
				this.pendingTicketsBySkill.push({
					'cd_skill': skill.cd_skill,
					'tx_skill': skill.tx_skill,
					'tickets': waiting.filter(ticket => ticket.id_skill === skill._id && ticket.tm_end === null)
				});
			}
		})
			.catch(() => {
				this.message = 'Error al obtener los tickets';
			})

	}


	askForEndTicket(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.snack.open('Desea finalizar el ticket en curso?', 'ACEPTAR', { duration: 10000 }).afterDismissed().subscribe(data => {
				if (data.dismissedByAction) {
					this.ticketsService.endTicket(this.ticketsService.myTicket._id).subscribe((resp: TicketResponse) => {
						this.message = resp.msg;
						resp.ok ? resolve() : reject();
					});
				}
			});
		})
	}

	async takeTicket() {

		if (this.ticketsService.myTicket) {
			await this.askForEndTicket().then(() => {
				this.clearSession();
			}).catch(() => {
				return;
			})
		}

		let cdDesk = this.cdDesk;
		let idDesk = this.userService.desktop._id;
		let idAssistant = this.userService.user._id;
		let idSocketDesk = this.wsService.idSocket;
		
		this.ticketsService.takeTicket(cdDesk, idDesk, idAssistant, idSocketDesk).subscribe(
			(resp: TicketResponse) => {

				this.snack.open(resp.msg, null, { duration: 2000 });
				this.getTickets();

				if (!resp.ok) {

					this.waitForClient = false;
					this.message = resp.msg;
					this.clearSession();

				} else {

					this.waitForClient = true;
					this.message = '';
					this.ticketsService.myTicket = resp.ticket;
					localStorage.setItem('ticket', JSON.stringify(resp.ticket));

					// Seteo el tiempo que el cliente estuvo en espera desde que saco su turno hasta que fué atendido
					this.tmWaiting = this.ticketsService.getTimeInterval(resp.ticket.tm_start, resp.ticket.tm_att);

					// DESKTOP WAITING TIMERS
					const encamino$ = this.wsService.escucharEnCamino();
					const timer_timeout$ = interval(1000).pipe(map(num => num + 1), take(DESK_TIMEOUT));
					let timeIsOut = false;
					timer_timeout$.pipe(
						tap(num => this.timerCount = DESK_TIMEOUT - num),
						takeUntil(encamino$)
					).subscribe(
						data => {	// next
							if (data >= DESK_TIMEOUT - 1) { timeIsOut = true; }
						},
						undefined, 	// error
						() => { 	// complete
							const timerEnd = new Promise((resolve) => {
								if (timeIsOut) { // Cliente no envió en camino, el operador puede cerrar el turno. 
									this.waitForClient = false;
									this.comingClient = false;
									resolve();
								} else { // Cliente envió en camino, corre un segundo observable que adiciona tiempo de espera.
									this.waitForClient = true;
									this.comingClient = true;
									const timer_extratime$ = interval(1000).pipe(
										map(num => num + 1),
										take(DESK_EXTRATIME)
									);

									timer_extratime$.subscribe(
										num => this.timerCount = DESK_EXTRATIME - num,  // next
										undefined, 	// error
										() => { 	// complete
											this.waitForClient = false;
											this.comingClient = false;
											resolve();
										});
								}

							});

							timerEnd.then(() => {
								// finalizo el tiempo de espera del cliente, comienza el tiempo del asistente.
								const timer_cliente$ = interval(1000);
								const start_cliente = new Date().getTime();
								this.tmRun = timer_cliente$.subscribe((data) => {
									this.tmAttention = this.ticketsService.getTimeInterval(start_cliente, + new Date());
								});
							});
						});
				}
			});

		this.getTickets();

	}

	assignTicket(): void {

	}

	releaseTicket(): void {
		this.ticketsService.releaseTicket(this.ticketsService.myTicket._id).subscribe((resp: TicketResponse) => {
			if (resp.ok) {
				this.clearSession();
				this.message = resp.msg;
			}
		})
	}

	endTicket(): void {
		this.ticketsService.endTicket(this.ticketsService.myTicket._id).subscribe((resp: TicketResponse) => {
			if (resp.ok) {
				this.clearSession();
				this.message = resp.msg;
			}
		})
	}

	clearSession() {
		this.ticketsService.myTicket = null;
		if (localStorage.getItem('ticket')) { localStorage.removeItem('ticket'); }
		this.ticketsService.chatMessages = [];
		this.tmWaiting = '--:--:--';
		this.tmAttention = '--:--:--';
		this.tmRun.unsubscribe();
	}

	releaseDesktop(): void {
		let idDesktop = this.userService.desktop._id
		this.userService.releaseDesktop(idDesktop).subscribe((data: DesktopResponse) => {
			if (data.ok) {
				this.clearSession();
				this.router.navigate(['assistant/home']);
			}
		})
	}
}
