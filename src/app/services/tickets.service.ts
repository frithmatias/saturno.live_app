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

	chatMessages: {
		own: boolean,
		time: Date,
		message: string,
		viewed: boolean
	  }[] = [];


	constructor(private http: HttpClient) {
		this.getTickets();
		this.getMyTicket()
		.then((myTicket: Ticket) => { // get from localstorage
			if ( myTicket.tm_end ) { // si el ticket esta finalizado limpio la sesión
				this.clearPublicSession();
			} else { // reinició el navegador pero el ticket esta vigente.
				this.myTicket = myTicket;
			}
		})
		.catch(() => {
			// no existe ticket en LS
		});
	}

	// todo: si es escritorio entonces actualizar id_socket_desk en lugar de id_socket
	actualizarSocket(oldSocket: string, newSocket: string): Observable<object> {
		const socketsData = { oldSocket, newSocket };
		return this.http.put(environment.url + '/actualizarsocket', socketsData);
	}
	
	// ========================================================
	// PUBLIC METHODS
	// ========================================================

	nuevoTicket(idSocket: string): Observable<object> {
		this.clearPublicSession();
		return this.http.get(environment.url + '/nuevoticket/' + idSocket);
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

	clearPublicSession(): void {
		this.myTicket = null;
		this.chatMessages = [];
		if (localStorage.getItem('turno')) { localStorage.removeItem('turno'); }
	}
	
	// ========================================================
	// DESKTOP METHODS
	// ========================================================
		
	getPendingTicket(idDesk: number): Observable<object> {
		const url = environment.url + '/pendingticket/' + idDesk;
		return this.http.get(url);
	}

	atenderTicket(idDesk: number, idDeskSocket: string): Observable<object> {
		const deskData = { idDesk, idDeskSocket };
		const url = environment.url + '/atenderticket';
		return this.http.post(url, deskData);
	}

	devolverTicket(idDesk: number): Observable<object> {
		const deskData = { idDesk };
		const url = environment.url + '/devolverticket';
		return this.http.post(url, deskData);
	}

	finalizarTicket(idDesk: number): Observable<object> {
		const deskData = { idDesk };
		const url = environment.url + '/finalizarticket';
		return this.http.post(url, deskData);
	}

	// ========================================================
	// SHARED METHODS
	// ========================================================

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
				.then((ls_ticket: Ticket) => {
					// Actualizar mi ticket desde la lista ticketsCall
					const myUpdatedTicket = this.ticketsCall.filter(ticket => ticket.id_ticket === ls_ticket.id_ticket)[0];
					if (myUpdatedTicket) {
						this.myTicket = myUpdatedTicket;
						localStorage.setItem('turno', JSON.stringify(this.myTicket));
					} else {
						// si no esta en la lista de tickets llamados (ticketsCall) se dio rollback y vuelve a la lista de espera
						this.myTicket.id_desk = null;
						this.myTicket.id_socket_desk = null;
						this.myTicket.tm_att = null;
						localStorage.setItem('turno', JSON.stringify(this.myTicket));
					}

					if (this.lastTicket === undefined) {
						// lasTicket no existe, todavía no se llamó a ningún ticket.
						return;
					}

					if (this.myTicket.tm_end !== null) {
						// El ticket finalizó.
						this.myTicket_end = this.myTicket.tm_end;
						this.clearPublicSession();
					}
				})
				.catch(() => {
					// console.log('No existe ticket para actualizar en LS.');
				});
		});
	}

	getTimeInterval(from: number, to?: number): string {
		let interval = to - from;
		let h = Math.floor(interval / 1000 / 60 / 60);
		interval = interval - (h * 60 * 60 * 1000); 
		let m = Math.floor(interval / 1000 / 60);
		interval = interval - (m * 60 * 1000); 
		let s = Math.floor(interval / 1000);
		let hStr = h.toString().length === 1 ? '0'+ h : h;
		let mStr = m.toString().length === 1 ? '0'+ m : m;
		let sStr = s.toString().length === 1 ? '0'+ s : s;
		return `${hStr}:${mStr}:${sStr}`;
	}

	getDate(time: number): void {

	}


}
