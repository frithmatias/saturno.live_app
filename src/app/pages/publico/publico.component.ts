import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { TicketsService } from '../../services/tickets.service';
import { TicketResponse, Ticket } from '../../interfaces/ticket.interface';
import { catchError } from 'rxjs/operators';
import { AjaxError } from 'rxjs/ajax';
import { Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
	selector: 'app-publico',
	templateUrl: './publico.component.html',
	styleUrls: ['./publico.component.css']
})
export class PublicoComponent implements OnInit {
	dni: number;
	loading = false;
	constructor(
		private wsService: WebsocketService,
		public ticketsService: TicketsService,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('container');
	}

	extend(): void {
		this.wsService.emit('extender-tiempo-atencion', this.ticketsService.myTicket);
	}
}

