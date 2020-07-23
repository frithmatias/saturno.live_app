import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';
import { TicketsService } from '../../../services/tickets.service';
import { Router } from '@angular/router';
import { TicketResponse } from '../../../interfaces/ticket.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Skill } from 'src/app/interfaces/skill.interface';
import { SkillsResponse } from '../../../interfaces/skill.interface';

@Component({
	selector: 'app-turnos',
	templateUrl: './turnos.component.html',
	styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {
	loading: boolean;
	skills: Skill[];
	constructor(
		private wsService: WebsocketService,
		public ticketsService: TicketsService,
		private router: Router,
		private snack: MatSnackBar
	) { }

	ngOnInit(): void {
		if (this.ticketsService.myTicket) {
			this.snack.open('Usted ya tiene un turno!', null, { duration: 5000 });
			this.router.navigate(['/publico/pantalla']);
		} else {
			if (!this.ticketsService.companyData) {
				this.snack.open('Por favor ingrese una empresa primero.', null, { duration: 5000 });
				this.router.navigate(['/publico']);
			} else {
				this.ticketsService.readSkills(this.ticketsService.companyData._id).subscribe((data: SkillsResponse) => {
					this.skills = data.skills;
				})
			}
		}
	}

	nuevoTicket(idSkill: string, cdSkill: string): void {
		this.loading = true;
		let idCompany = this.ticketsService.companyData._id;
		let idSocket = this.wsService.idSocket;
		
		this.ticketsService.nuevoTicket(idCompany, idSkill, cdSkill, idSocket).subscribe(
			(data: TicketResponse) => {
				if (data.ok) {
					localStorage.setItem('ticket', JSON.stringify(data.ticket));
					this.ticketsService.myTicket = data.ticket;
					this.loading = false;
					this.router.navigate(['/publico/pantalla']);
				}
			}
		);
	}


}
