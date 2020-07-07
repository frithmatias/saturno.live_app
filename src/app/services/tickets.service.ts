import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map, catchError, take } from 'rxjs/operators';
import { Ticket, TicketsResponse } from '../interfaces/ticket.interface';
import { AjaxError } from 'rxjs/ajax';
import { of, Observable, interval } from 'rxjs';

const TAIL_LENGTH = 4;

@Injectable({
	providedIn: 'root'
})
export class TicketsService {
	ticketsAll: Ticket[] = [];
	ticketsCall: Ticket[] = [];
	ticketsTail: Ticket[] = [];
	obsTicket: Observable<Ticket>;
	myTicket: Ticket;
	myTicket_end: number;
	lastTicket: Ticket;


	constructor(private http: HttpClient) {
		this.getMyTicket().then((myTicket: Ticket) => {
			this.myTicket = myTicket;
			this.getTickets();
		}).catch(() => this.getTickets());
	}

	// todo: si es escritorio entonces actualizar id_socket_desk en lugar de id_socket
	actualizarSocket(oldSocket: string, newSocket: string): Observable<object> {
		const socketsData = { oldSocket, newSocket };
		return this.http.put(environment.url + '/actualizarsocket', socketsData);
	}

	nuevoTicket(idSocket: string): Observable<object> {
		return this.http.get(environment.url + '/nuevoticket/' + idSocket);
	}

	atenderTicket(idDesk: number, idDeskSocket: string): Observable<object> {
		const deskData = { idDesk, idDeskSocket };
		const url = environment.url + '/atenderticket';
		return this.http.post(url, deskData);
	}

	getPendingTicket(idDesk: number): Observable<object> {
		const url = environment.url + '/pendingticket/' + idDesk;
		return this.http.get(url);
	}

	getMyTicket(): Promise<Ticket | string> {
		return new Promise((resolve, reject) => {
			if (localStorage.getItem('turno')) {
				resolve(this.myTicket = JSON.parse(localStorage.getItem('turno')));
			} else {
				reject('Usted no tiene un turno.');
			}
		});
	}

	getTickets(): void {
		const url = environment.url + '/gettickets';

		const getError = (err: AjaxError) => {
			return of([{ idDesk: 'err', id_ticket: 'err', status: 'err' }]);
		};

		this.http.get(url).pipe(
			map<TicketsResponse, Ticket[]>(data => data.tickets),
			catchError(getError)
		).subscribe((data: Ticket[]) => {
			// !obtiene los tickets antes de que el servicio de sockets pueda actualizar el id_socket
			this.ticketsAll = data;
			this.ticketsCall = data.filter(ticket => ticket.tm_att !== null);
			this.ticketsTail = [...this.ticketsCall].sort((a: Ticket, b: Ticket) => -1).slice(0, TAIL_LENGTH);
			this.lastTicket = this.ticketsTail[0];

			// si había un ticket en LS lo actualizo
			this.getMyTicket()
				.then((myticket: Ticket) => {
					// Actualizar mi ticket desde la lista ticketsCall
					const myUpdatedTicket = this.ticketsCall.filter(ticket => ticket.id_ticket === myticket.id_ticket)[0];
					if (myUpdatedTicket) {
						this.myTicket = myUpdatedTicket;
						localStorage.setItem('turno', JSON.stringify(this.myTicket));
					}

					if (this.lastTicket === undefined) {
						// lasTicket no existe, todavía no se llamó a ningún ticket.
						return;
					}
					
					if (this.myTicket.tm_end !== null) {
						// El ticket finalizó.
						this.myTicket_end = this.myTicket.tm_end;
						this.myTicket = null;
						localStorage.removeItem('turno');
					}
				})
				.catch(() => {
					// console.log('No existe ticket para actualizar en LS.');
				});
		});
	}
}
