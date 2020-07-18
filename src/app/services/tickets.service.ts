import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map, catchError, take } from 'rxjs/operators';
import { Ticket, TicketsResponse } from '../interfaces/ticket.interface';
import { AjaxError } from 'rxjs/ajax';
import { of, Observable, interval } from 'rxjs';
import { UserService } from './user.service';
import { Router } from '@angular/router';

const TAIL_LENGTH = 4;

@Injectable({
	providedIn: 'root'
})
export class TicketsService {
	companyData: any;
	userPreset = false;
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


	constructor(
		private http: HttpClient,
		private userService: UserService,
		private router: Router
	) {

		if (localStorage.getItem('company')) {
			this.companyData = JSON.parse(localStorage.getItem('company'));
			this.getTickets();
		};

		if (localStorage.getItem('ticket')) {
			this.myTicket = JSON.parse(localStorage.getItem('ticket'));
			if (this.myTicket.tm_end) { // si el ticket esta finalizado limpio la sesión
				this.clearPublicSession();
			}
		} else {
			this.clearPublicSession();
		}


	}

	getUserData(companyName: string): Observable<object> {
		return this.http.get(environment.url + '/p/getuserdata/' + companyName);
	}

	clearPublicSession(): void {
		this.chatMessages = [];
		this.myTicket = null;
		this.companyData = null;
		if (localStorage.getItem('ticket')) { localStorage.removeItem('ticket'); }
		if (localStorage.getItem('company')) { localStorage.removeItem('company'); }
	}

	actualizarSocket(idTicket: string, newSocket: string): Observable<object> {
		const socketsData = { idTicket, newSocket };
		return this.http.put(environment.url + '/t/actualizarsocket', socketsData);
	}

	nuevoTicket(idSocket: string, typeTicket: string, idCompany: string): Observable<object> {
		let data = { idSocket, typeTicket, idCompany };
		return this.http.post(environment.url + '/t/nuevoticket/', data);
	}

	cancelTicket(idTicket: string) {
		return this.http.get(environment.url + '/t/cancelticket/' + idTicket);
	}

	getPendingTicket(idDesk: number): Observable<object> {
		const url = environment.url + '/t/pendingticket/' + idDesk;
		return this.http.get(url);
	}

	atenderTicket(idDesk: number, idDeskSocket: string): Observable<object> {
		const headers = new HttpHeaders({
			'turnos-token': this.userService.token
		});

		const deskData = { idDesk, idDeskSocket };
		const url = environment.url + '/t/atenderticket';
		return this.http.post(url, deskData, { headers });
	}

	devolverTicket(idDesk: number): Observable<object> {
		const deskData = { idDesk };
		const url = environment.url + '/t/devolverticket';
		return this.http.post(url, deskData);
	}

	finalizarTicket(idDesk: number): Observable<object> {
		const deskData = { idDesk };
		const url = environment.url + '/t/finalizarticket';
		return this.http.post(url, deskData);
	}

	getTickets(): void {
		let id_company: string;
		if (this.companyData) {
			id_company = this.companyData._id;
		} else if (this.userService.usuario) {
			id_company = this.userService.usuario._id;
		}
		if (!id_company) {
			return;
		}
		console.log('obteniendo tickets para ', id_company);
		const url = environment.url + '/t/gettickets/' + id_company;
		const getError = (err: AjaxError) => {
			return of([{ idDesk: 'err', id_ticket: 'err', status: 'err' }]);
		};

		this.http.get(url).pipe(
			map<TicketsResponse, Ticket[]>(data => data.tickets),
			catchError(getError)
		).subscribe((data: Ticket[]) => {
			console.log(data);
			if (data.length === 0) {
				return;
			}
			// !obtiene los tickets antes de que el servicio de sockets pueda actualizar el id_socket
			this.ticketsAll = data;
			console.log(this.ticketsAll);
			this.ticketsCall = data.filter(ticket => ticket.tm_att !== null);
			this.ticketsTail = [...this.ticketsCall].sort((a: Ticket, b: Ticket) => -1).slice(0, TAIL_LENGTH);
			this.lastTicket = this.ticketsTail[0];
			console.log(this.ticketsTail);
			// update ticket
			if (this.myTicket) {
				const myUpdatedTicket = this.ticketsCall.filter(ticket => ticket.id_ticket === this.myTicket.id_ticket && ticket.id_type === this.myTicket.id_type)[0];
				if (myUpdatedTicket) {
					this.myTicket = myUpdatedTicket;
					localStorage.setItem('ticket', JSON.stringify(this.myTicket));
				} else {
					// rollback
					this.myTicket.id_desk = null;
					this.myTicket.id_socket_desk = null;
					this.myTicket.tm_att = null;
					localStorage.setItem('ticket', JSON.stringify(this.myTicket));
				}

				// El ticket finalizó.
				if (this.myTicket.tm_end !== null) {
					this.myTicket_end = this.myTicket.tm_end;
					this.clearPublicSession();
				}
			}

			if (this.lastTicket === undefined) {
				// todavía no se llamó a ningún ticket.
				return;
			}
		});
	}

	getTimeInterval(from: number, to?: number): string {
		let interval = to - from;
		let h = Math.floor(interval / 1000 / 60 / 60);
		interval = interval - (h * 60 * 60 * 1000);
		let m = Math.floor(interval / 1000 / 60);
		interval = interval - (m * 60 * 1000);
		let s = Math.floor(interval / 1000);
		let hStr = h.toString().length === 1 ? '0' + h : h;
		let mStr = m.toString().length === 1 ? '0' + m : m;
		let sStr = s.toString().length === 1 ? '0' + s : s;
		return `${hStr}:${mStr}:${sStr}`;
	}

}
