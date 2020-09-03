import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map, catchError } from 'rxjs/operators';
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

	allMytickets: Ticket[] = [];
	myTicket: Ticket;
	myTicketTmEnd: number = null;

	lastTicket: Ticket;
	ticketsAll: Ticket[] = [];
	ticketsCall: Ticket[] = [];
	ticketsTail: Ticket[] = [];

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

	readSkills(idCompany: string): Observable<SkillsResponse> {
		return this.http.get<SkillsResponse>(environment.url + '/s/readskills/' + idCompany);
	}

	readSkillsUser(idUser): Observable<SkillsResponse> {
		return this.http.get<SkillsResponse>(environment.url + '/s/readskillsuser/' + idUser);
	}

	clearPublicSession(): void {
		this.chatMessages = [];
		this.myTicket = null;
		this.companyData = null;
		if (localStorage.getItem('ticket')) { localStorage.removeItem('ticket'); }
		if (localStorage.getItem('company')) { localStorage.removeItem('company'); }
	}

	clearPublicSessionComplete(): void {
		this.router.navigate(['/public']);
		this.allMytickets = null;

	}

	actualizarSocket(idTicket: string, oldSocket: string, newSocket: string): Observable<object> {
		const socketsData = { idTicket, oldSocket, newSocket };
		return this.http.put(environment.url + '/t/actualizarsocket', socketsData);
	}

	createTicket(idSkill: string, idSocket: string, blPriority: boolean = false): Observable<object> {
		let data = { idSkill, idSocket, blPriority };
		return this.http.post(environment.url + '/t/createticket/', data);
	}

	cancelTicket(idTicket: string) {
		return this.http.get(environment.url + '/t/cancelticket/' + idTicket);
	}

	sendScores(cdScores: any) {
		const url = environment.url + `/p/scores`;
		return this.http.post(url, cdScores);
	}

	sendContact(data: any) {
		const url = environment.url + `/p/contact`;
		return this.http.post(url, data);
	}

	// desktop methods

	takeTicket(idSession: string, idSocketDesk: string): Observable<object> {

		const headers = new HttpHeaders({
			'turnos-token': this.userService.token
		});

		const deskData = { idSession, idSocketDesk };

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

	reassignTicket(idTicket: string, idSkill: string, blPriority: boolean): Observable<object> {
		const data = { idTicket, idSkill, blPriority };
		const headers = new HttpHeaders({
			'turnos-token': this.userService.token
		});
		const url = environment.url + '/t/reassignticket';
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
			let idCompany = this.companyData ? this.companyData._id : this.userService.user.id_company._id;
			if (!idCompany) { return; }
			const url = environment.url + '/t/gettickets/' + idCompany;
			this.http.get(url).subscribe((data: TicketsResponse) => {

				if (data.tickets.length === 0) {
					resolve(data.tickets);
				} else {
					this.ticketsAll = data.tickets;
					this.ticketsCall = data.tickets.filter(ticket => ticket.tm_att !== null);
					this.ticketsTail = [...this.ticketsCall].sort((a: Ticket, b: Ticket) => -1).slice(0, TAIL_LENGTH);
					this.lastTicket = this.ticketsTail[0];
					this.updateMyTicket();
					resolve(data.tickets);
				}

			});
		});
	}

	updateMyTicket(): void {
		if (this.myTicket) { // client and assistant
			// pick LAST ticket
			const pickMyTicket = this.ticketsAll.filter(ticket => (
				ticket.id_root === this.myTicket.id_root && ticket.id_child === null
			))[0];

			if (pickMyTicket) {
				if (pickMyTicket.tm_end !== null && pickMyTicket.id_child === null) {
					// El ticket finalizó.
					this.myTicket = null;
					this.myTicketTmEnd = pickMyTicket.tm_end;
					this.clearPublicSession();
				} else {
					this.myTicket = pickMyTicket;
					localStorage.setItem('ticket', JSON.stringify(this.myTicket));

					this.allMytickets = this.ticketsAll.filter(ticket => (
						(ticket.id_root === pickMyTicket.id_root)
					))
				}
			}
		}
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
