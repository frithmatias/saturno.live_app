import { Injectable, Output, EventEmitter } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, of } from 'rxjs';
import { TicketsService } from './tickets.service';
import { AjaxError } from 'rxjs/ajax';
import { catchError, take } from 'rxjs/operators';
import { Ticket } from '../interfaces/ticket.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {
	public socketStatus = false;
	public usuario = null;
	public idSocket = null;
	constructor(
		private socket: Socket,
		private ticketsService: TicketsService,
		private snack: MatSnackBar,
	) {
		this.escucharConexiones();
		this.escucharActualizarPantalla();
	}


	escucharEnCamino(): Observable<string> {
		// con take solo dejo pasar una sola emisión luego se des suscribe.
		return this.listen('cliente-en-camino').pipe(take(3));
	}

	escucharMensajes(): Observable<string> {
		return this.listen('mensaje-privado');
	}

	escucharTurnos(): Observable<string> {
		return this.listen('nuevo-turno');
	}

	escucharSystem(): Observable<string> {
		return this.listen('mensaje-system');
	}

	escucharActualizarPantalla(): void {
		this.listen('actualizar-pantalla').subscribe(data => {
			this.ticketsService.getTickets();
			const audio = new Audio();
			audio.src = '../../assets/new-ticket.mp3';
			audio.load();
			audio.play();
		});
	}

	escucharConexiones(): void {

		this.socket.on('connect', () => {
			this.snack.open('Conectado al servidor de turnos', null, { duration: 5000 });
			// si había un ticket en la LS lo actualizo
			this.idSocket = this.socket.ioSocket.id;
			if (localStorage.getItem('turno')) {
				const myTicket: Ticket = JSON.parse(localStorage.getItem('turno'));
				this.ticketsService.actualizarSocket(myTicket._id, this.idSocket).pipe(
					catchError(this.manejaError)
				).subscribe((data: any) => {
					if (data.ok) {
						// si lo actualizo el ticket en la BD actualizo en myTicket y en la LS
						this.ticketsService.myTicket.id_socket = this.idSocket;
						localStorage.setItem('turno', JSON.stringify(this.ticketsService.myTicket));
					}
				});
			} 
			this.socketStatus = true;
		});

		this.socket.on('disconnect', () => {
			this.snack.open('Desconectado del servidor de turnos.', null, { duration: 5000 });
			this.socketStatus = false;
		});
	}

	emit(evento: string, payload?: any, callback?: () => void): void {
		this.socket.emit(evento, payload, callback);
	}

	listen(evento: string): Observable<string> {
		return this.socket.fromEvent(evento);
	}

	manejaError = (err: AjaxError) => {
		// error al actualizar el socket, el socket anterior no existe
		localStorage.removeItem('turno');
		return of<AjaxError>(err);  // <b
	}

}
