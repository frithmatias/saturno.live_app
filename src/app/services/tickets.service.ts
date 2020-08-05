import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map, catchError, take } from 'rxjs/operators';
import { Ticket, TicketsResponse } from '../interfaces/ticket.interface';
import { AjaxError } from 'rxjs/ajax';
import { of, Observable, interval } from 'rxjs';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { SkillsResponse } from '../interfaces/skill.interface';

const TAIL_LENGTH = 4;

@Injectable({
	providedIn: 'root'
})
export class TicketsService {
	
	companyData: any;
	publicMode: boolean = false;
	
	myTicket: Ticket;
	myTicket_end: number;
	
	ticketsAll: Ticket[] = [];
	ticketsCall: Ticket[] = [];
	ticketsTail: Ticket[] = [];
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
	) { }

	// public methods

	readCompany(txPublicName: string): Observable<object> {
		return this.http.get(environment.url + '/c/readcompany/' + txPublicName);
	}

	findCompany(pattern: string): Observable<object> {
		return this.http.get(environment.url + '/c/findcompany/' + pattern);
	}

	readSkills(idUser: string): Observable<SkillsResponse> {
		return this.http.get<SkillsResponse>(environment.url + '/s/readskills/' + idUser);
	}

	readSkillsCompany(idCompany): Observable<SkillsResponse> {
		return this.http.get<SkillsResponse>(environment.url + '/s/readskillscompany/' + idCompany);
	}


	clearPublicSession(): void {
		this.chatMessages = [];
		this.myTicket = null;
		this.companyData = null;
		if (localStorage.getItem('ticket')) { localStorage.removeItem('ticket'); }
		if (localStorage.getItem('company')) { localStorage.removeItem('company'); }
	}

	actualizarSocket(idTicket: string, oldSocket: string, newSocket: string): Observable<object> {
		const socketsData = { idTicket, oldSocket, newSocket };
		return this.http.put(environment.url + '/t/actualizarsocket', socketsData);
	}

	nuevoTicket(idCompany: string, idSkill: string, cdSkill: string, idSocket: string): Observable<object> {
		let data = { idCompany, idSkill, cdSkill, idSocket };

		return this.http.post(environment.url + '/t/nuevoticket/', data);
	}

	cancelTicket(idTicket: string) {
		return this.http.get(environment.url + '/t/cancelticket/' + idTicket);
	}

	sendContact(data: any) {
		const url = environment.url + `/p/contact`;
		return this.http.post(url, data);
	}

	// desktop methods

	takeTicket(cdDesk: string, idDesk: string, idAssistant: string, idSocketDesk: string): Observable<object> {

		const headers = new HttpHeaders({
			'turnos-token': this.userService.token
		});

		const deskData = { cdDesk, idDesk, idAssistant, idSocketDesk };

		const url = environment.url + `/t/taketicket`;
		return this.http.post(url, deskData, { headers });
	}

	releaseTicket(idTicket: string): Observable<object> {
		const data = { idTicket };
		const headers = new HttpHeaders({
			'turnos-token': this.userService.token
		});
		const url = environment.url + '/t/releaseticket';
		return this.http.post(url, data, { headers });
	}

	endTicket(idTicket: string): Observable<object> {
		const data = { idTicket };
		const headers = new HttpHeaders({
			'turnos-token': this.userService.token
		});
		const url = environment.url + '/t/endticket';
		return this.http.post(url, data, { headers });
	}

	getTickets(): Promise<any> {
		return new Promise((resolve, reject) => {

			let id_company: string;

			if (this.companyData) {
				id_company = this.companyData._id;
			} else if (this.userService.usuario) {
				id_company = this.userService.usuario.id_company._id;
			}

			if (!id_company) {
				
				return;
			}

			const url = environment.url + '/t/gettickets/' + id_company;
			const getError = (err: AjaxError) => {
				reject();
				return of([{ idDesk: 'err', id_ticket: 'err', status: 'err' }]);
			};

			this.http.get(url).pipe(
				map<TicketsResponse, Ticket[]>(data => data.tickets),
				catchError(getError)
			).subscribe((data: Ticket[]) => {

				if (data.length === 0) {
					reject();
					return;
				}
				// !obtiene los tickets antes de que el servicio de sockets pueda actualizar el id_socket
				this.ticketsAll = data;
				this.ticketsCall = data.filter(ticket => ticket.tm_att !== null);
				this.ticketsTail = [...this.ticketsCall].sort((a: Ticket, b: Ticket) => -1).slice(0, TAIL_LENGTH);
				this.lastTicket = this.ticketsTail[0];
				
				
				
				// update ticket
				if (this.myTicket) {
					const myUpdatedTicket = this.ticketsAll.filter(ticket => ticket._id === this.myTicket._id)[0];

					if (myUpdatedTicket) {
						this.myTicket = myUpdatedTicket;
						localStorage.setItem('ticket', JSON.stringify(this.myTicket));
					}

					// El ticket finalizó.
					if (this.myTicket.tm_end !== null) {
						this.myTicket_end = this.myTicket.tm_end;
						this.clearPublicSession();
					}
				}

				resolve(data);
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
		let hStr = h.toString().length === 1 ? '0' + h : h;
		let mStr = m.toString().length === 1 ? '0' + m : m;
		let sStr = s.toString().length === 1 ? '0' + s : s;
		return `${hStr}:${mStr}:${sStr}`;
	}




}
