import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { TicketResponse, Ticket } from '../../../interfaces/ticket.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, Subscription } from 'rxjs';
import { take, takeUntil, tap, map, takeWhile } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { DesktopResponse } from 'src/app/interfaces/desktop.interface';
import { Skill, SkillsResponse } from 'src/app/interfaces/skill.interface';

const DESK_TIMEOUT = 30; // 60 segundos
const DESK_EXTRATIME = 60; // 120 segundos
export interface Tile {
	color: string;
	cols: number;
	rows: number;
	text: string;
}
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
	skills: Skill[] = [];
	skillsAssistant: Skill[] = [];
	skillSelected: string = '';
	blPriority = false;

	constructor(
		public ticketsService: TicketsService,
		public userService: UserService,
		private wsService: WebsocketService,
		private snack: MatSnackBar,
		private router: Router
	) { }

	async ngOnInit() {

		if (this.userService.user.id_skills) {
			this.skillsAssistant = this.userService.user.id_skills;
			// todo: crear coleccion userskills, si un usuario tiene dos o mas comercios, al hacer 
			// todo: un attachCompany, me debe traer los skills del comercio seleccionado.
		}
		await this.readSkills().then((data: Skill[]) => {
			this.skills = data;
		}).catch(() => { this.snack.open('Error al obtener los skills', null, { duration: 2000 }); })

		await this.getTickets();

		this.wsService.escucharNuevoTurno().subscribe(() => {
			this.getTickets();
		});

		this.wsService.escucharTurnoCancelado().subscribe(idTicket => {
			this.snack.open('Turno cancelado por el cliente', null, { duration: 5000 });
			if (this.ticketsService.myTicket?._id === idTicket) {
				this.message = 'El turno fue cancelado por el cliente.';
				this.clearDesktopSession();
			}
			this.getTickets();
		});

	}

	async getTickets() {
		// traigo todos los tickets
		return this.ticketsService.getTickets().then((tickets: Ticket[]) => {
			// DESKTOP: verifico si existe un ticket anterior pendiente 

			const pending = tickets.filter(ticket => {
				return (
					// id_desk optional -> client can cancel ticket.
					ticket.id_desk?._id === this.userService.desktop._id &&
					ticket.tm_end === null &&
					ticket.id_child === null

				);
			})[0];

			if (pending) {
				this.message = 'Existe un ticket pendiente de resolución'
				this.ticketsService.myTicket = pending;
				localStorage.setItem('ticket', JSON.stringify(pending));
			}

			let skillsCompany = this.skills;
			let skillsAssistant = [];
			this.userService.user.id_skills.forEach(skill => skillsAssistant.push(skill._id));

			const ticketsWaitingAssistant = tickets.filter(ticket => ticket.tm_end === null && ticket.id_child === null && skillsAssistant.includes(ticket.id_skill._id));
			const ticketsWaitingTeam = tickets.filter(ticket => ticket.tm_end === null && ticket.id_child === null);

			this.pendingTicketsCount = ticketsWaitingAssistant.length;

			if (ticketsWaitingAssistant.length > 0) { this.message = `Hay ${ticketsWaitingAssistant.length} tickets en espera`; }

			// table pending skills
			this.pendingTicketsBySkill = [];
			// const idSkills = this.userService.user.id_skills;
			for (let skillCompany of skillsCompany) {
				this.pendingTicketsBySkill.push({
					'id': skillCompany._id,
					'assigned': skillsAssistant.includes(skillCompany._id),
					'cd_skill': skillCompany.cd_skill,
					'tx_skill': skillCompany.tx_skill,
					'tickets': ticketsWaitingTeam.filter(ticket => ticket.id_skill._id === skillCompany._id && ticket.tm_end === null)
				});
			}
		})
			.catch(() => {
				this.message = 'Error al obtener los tickets';
			})

	}

	clearDesktopSession() {
		this.getTickets();
		this.ticketsService.myTicket = null;
		if (localStorage.getItem('ticket')) { localStorage.removeItem('ticket'); }
		this.ticketsService.chatMessages = [];
		this.tmWaiting = '--:--:--';
		this.tmAttention = '--:--:--';
		if (this.tmRun) { this.tmRun.unsubscribe(); }
	}

	async releaseDesktop() {

		if (this.ticketsService.myTicket) {
			let snackMsg = 'Tiene una sesión de turno activa. ¿Desea finalizarla?';
			return await this.askForContinue(snackMsg).then(() => {
				// end ticket session
				this.ticketsService.endTicket(this.ticketsService.myTicket._id).subscribe((resp: TicketResponse) => {
					if (resp.ok) {
						let idDesktop = this.userService.desktop._id
						this.userService.releaseDesktop(idDesktop).subscribe((data: DesktopResponse) => {
							if (data.ok) {
								this.clearDesktopSession();
								this.router.navigate(['assistant/home']);
							} else {
								this.message = resp.msg;
							}
						})
					}
				})
			}).catch(() => {
				return;
			})
		}

		// end desktop session
		let idDesktop = this.userService.desktop._id
		this.userService.releaseDesktop(idDesktop).subscribe((data: DesktopResponse) => {
			if (data.ok) {
				this.clearDesktopSession();
				this.router.navigate(['assistant/home']);
			}
		})

	}

	readSkills(): Promise<Skill[]> {
		return new Promise((resolve, reject) => {
			let idCompany = this.userService.user.id_company?._id;
			this.userService.readSkills(idCompany).subscribe((data: SkillsResponse) => {
				if (data.ok) {
					resolve(data.skills);
				} else {
					reject([])
				}
			})
		})
	}

	// ========================================================
	// Assistant Actions
	// ========================================================

	askForContinue(snackMsg: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.snack.open(snackMsg, 'ACEPTAR', { duration: 5000 }).afterDismissed().subscribe(data => {
				if (data.dismissedByAction) {
					resolve();
				} else {
					reject()
				}
			});
		})
	}

	async takeTicket() {
		if (this.ticketsService.myTicket) {
			let snackMsg = 'Desea finalizar el ticket actual?';
			return await this.askForContinue(snackMsg).then(() => {
				this.ticketsService.endTicket(this.ticketsService.myTicket._id).subscribe((resp: TicketResponse) => {
					if (resp.ok) {
						this.clearDesktopSession();
						this.message = resp.msg;
					}
				})
			}).catch(() => {
				return;
			})
		}

		let idDesk = this.userService.desktop._id;
		let idAssistant = this.userService.user._id;
		let idSocketDesk = this.wsService.idSocket;

		this.ticketsService.takeTicket(idDesk, idAssistant, idSocketDesk).subscribe((resp: TicketResponse) => {

			this.snack.open(resp.msg, null, { duration: 2000 });
			this.getTickets();

			if (!resp.ok) {

				this.waitForClient = false;
				this.message = resp.msg;
				this.clearDesktopSession();

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

	async releaseTicket() {
		if (this.ticketsService.myTicket) {
			let snackMsg = 'Desea soltar el ticket y devolverlo a su estado anterior?';
			await this.askForContinue(snackMsg).then(() => {
				let idTicket = this.ticketsService.myTicket._id;
				this.ticketsService.releaseTicket(idTicket).subscribe((resp: TicketResponse) => {
					if (resp.ok) {
						this.clearDesktopSession();
						this.message = resp.msg;
					}
				})
			}).catch(() => {
				return;
			})
		}
	}

	async reassignTicket() {
		if (this.ticketsService.myTicket) {
			let snackMsg = 'Desea enviar el ticket al skill seleccionado?'
			await this.askForContinue(snackMsg).then(() => {
				let idTicket = this.ticketsService.myTicket?._id;
				let idSkill = this.skillSelected;
				let blPriority = this.blPriority;
				if (idTicket && idSkill) {
					this.ticketsService.reassignTicket(idTicket, idSkill, blPriority).subscribe((resp: TicketResponse) => {
						if (resp.ok) {
							this.blPriority = false;
							this.clearDesktopSession();
							this.message = resp.msg;
						}
					});
				}
			}).catch(() => {
				return;
			})
		}
	}

	async endTicket() {
		if (this.ticketsService.myTicket) {
			let snackMsg = 'Desea finalizar el ticket actual?'
			await this.askForContinue(snackMsg).then(() => {
				this.ticketsService.endTicket(this.ticketsService.myTicket._id).subscribe((resp: TicketResponse) => {
					if (resp.ok) {
						this.clearDesktopSession();
						this.message = resp.msg;
					}
				})
			}).catch(() => {
				return;
			})
		}
	}
}
