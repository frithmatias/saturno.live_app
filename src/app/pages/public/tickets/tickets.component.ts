import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';
import { TicketsService } from '../../../services/tickets.service';
import { Router } from '@angular/router';
import { TicketResponse } from '../../../interfaces/ticket.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Skill } from '../../../interfaces/skill.interface';
import { SkillsResponse } from '../../../interfaces/skill.interface';
import { PublicService } from '../../../services/public.service';
import Swal from 'sweetalert2';

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
			this.snack.open('Usted ya tiene un turno!', null, { duration: 2000 });
			this.router.navigate(['/public/screen']);
		} else {
			if (!this.ticketsService.companyData) {
				this.snack.open('Por favor ingrese una empresa primero.', null, { duration: 2000 });
				this.router.navigate(['/public']);
			} else {
				let idCompany = this.ticketsService.companyData._id;
				this.wsService.emit('enterCompany', idCompany);
				this.ticketsService.readSkills(idCompany).subscribe((data: SkillsResponse) => {

					if (data.skills.length === 1 && data.skills[0].bl_generic) {
						data.skills[0].tx_skill = 'OBTENER TURNO';
					}
					this.skills = data.skills;
				})
			}
		}
	}

	createTicket(idSkill: string): void {
		
		if (localStorage.getItem('user')){
			Swal.fire({
				icon: 'error',
				title: 'Tiene una sesión de usuario activa',
				text: 'Usted está en una página de acceso al público pero tiene una sesión de usuario activa. Para obtener un turno debe cerrar la sesión de usuario o abrir una pestaña en modo incógnito.',
			  })	
			return;
		}

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
		this.router.navigate(['/public/search'])
	}

}
