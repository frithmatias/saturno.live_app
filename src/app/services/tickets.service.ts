import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map, catchError, tap } from 'rxjs/operators';
import { Ticket, TicketsResponse } from '../interfaces/ticket.interface';
import { AjaxError } from 'rxjs/ajax';
import { of, Observable, Observer, Subscriber } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { TicketResponse } from 'src/app/interfaces/ticket.interface';

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
	lastTicket: Ticket;

	constructor(private http: HttpClient) {
		this.getMyTicket().then((myTicket: Ticket) => {
			this.myTicket = myTicket;
			this.getTickets();
		}).catch(() => this.getTickets());
	}

	actualizarSocket(oldSocket: string, newSocket: string): Observable<object> {
		const socketsData = { oldSocket, newSocket };
		return this.http.put(environment.url + '/actualizarsocket', socketsData);
	}

	nuevoTicket(idSocket: string): Observable<object> {
		return this.http.get(environment.url + '/nuevoticket/' + idSocket)
			.pipe(
				tap((ticket: TicketResponse) => this.myTicket = ticket.ticket),
				// tap(() => console.log(this.myTicket))
			);
	}

	atenderTicket(idDesk: number): Observable<object> {
		const url = environment.url + '/atenderticket/' + idDesk;
		return this.http.get(url);
	}

	// el escritorio solicita el ultimo ticket pendiente en estado LL (null si no existe)
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
		const sendId = this.myTicket ? this.myTicket.id_ticket : 0;
		const url = environment.url + '/gettickets/' + sendId;

		const getError = (err: AjaxError) => {
			return of([{ idDesk: 'err', id_ticket: 'err', status: 'err' }]);
		};

		this.http.get(url).pipe(
			map<TicketsResponse, Ticket[]>(data => data.tickets),
			catchError(getError)
		).subscribe((data: Ticket[]) => {
			// !cuidado, obtiene los tickets antes de que el servicio de sockets pueda actualizar el id_socket
			this.ticketsAll = data;
			this.ticketsCall = data.filter(ticket => ticket.tm_att !== null);
			this.ticketsTail = [...this.ticketsCall].sort((a: Ticket, b: Ticket) => -1).slice(0, TAIL_LENGTH);
			this.lastTicket = this.ticketsTail[0];
			console.log(this.ticketsAll);
			// si había un ticket en LS lo actualizo
			if (localStorage.getItem('turno')) {
				// Actualizar mi ticket desde la lista ticketsCall
				const myUpdatedTicket = this.ticketsCall.filter(ticket => ticket.id_ticket === this.myTicket.id_ticket)[0];
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
					this.myTicket = null;
					localStorage.removeItem('turno');
				}
			}
		});
	}
}
