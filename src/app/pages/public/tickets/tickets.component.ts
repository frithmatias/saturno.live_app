import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';
import { TicketsService } from '../../../services/tickets.service';
import { Router } from '@angular/router';
import { TicketResponse } from '../../../interfaces/ticket.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Skill } from '../../../interfaces/skill.interface';
import { SkillsResponse } from '../../../interfaces/skill.interface';
import { PublicService } from '../../../services/public.service';

@Component({
	selector: 'app-tickets',
	templateUrl: './tickets.component.html',
	styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
	loading: boolean = false;
	skills: Skill[];
	blPriority = false;
	constructor(
		private wsService: WebsocketService,
		public ticketsService: TicketsService,
		private router: Router,
		private snack: MatSnackBar,
		private publicService: PublicService
	) { }

	ngOnInit(): void {
		if (this.ticketsService.myTicket) {
			this.snack.open('Usted ya tiene un turno!', null, { duration: 5000 });
			this.router.navigate(['/public/screen']);
		} else {
			if (!this.ticketsService.companyData) {
				this.snack.open('Por favor ingrese una empresa primero.', null, { duration: 5000 });
				this.router.navigate(['/public']);
			} else {
				let idCompany = this.ticketsService.companyData._id;
				this.wsService.emit('enterCompany', idCompany);
				this.ticketsService.readSkills(idCompany).subscribe((data: SkillsResponse) => {
					this.skills = data.skills;
				})
			}
		}
	}

	createTicket(idSkill: string): void {
		this.loading = true;

		let idSocket = this.wsService.idSocket;
		let blPriority = this.blPriority;
		this.ticketsService.createTicket(idSkill, idSocket, blPriority).subscribe(
			(data: TicketResponse) => {
				if (data.ok) {
					localStorage.setItem('ticket', JSON.stringify(data.ticket));
					this.ticketsService.myTicket = data.ticket;
					this.loading = false;
					this.router.navigate(['/public/screen']);
				}
			}
		);
	}

	salir(): void {
		if (localStorage.getItem('company')) { localStorage.removeItem('company'); }
		this.router.navigate(['/public'])
	}

}
