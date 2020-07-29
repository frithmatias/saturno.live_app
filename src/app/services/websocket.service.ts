import { Injectable, Output, EventEmitter } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, of } from 'rxjs';
import { TicketsService } from './tickets.service';
import { AjaxError } from 'rxjs/ajax';
import { catchError, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './user.service';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {
	public socketStatus = false;
	public idSocket = null;
	constructor(
		private socket: Socket,
		private ticketsService: TicketsService,
		private snack: MatSnackBar,
	) {
		this.escucharConexiones();
		this.escucharActualizarPantalla();
		this.escucharActualizarTicket();
	}



	escucharConexiones(): void {

		this.socket.on('connect', () => {
			this.snack.open('Conectado al servidor de turnos', null, { duration: 2000 });

			// si había un ticket en la LS lo actualizo
			this.idSocket = this.socket.ioSocket.id;
			
			if (localStorage.getItem('ticket') !== 'undefined') {
				let myTicket = JSON.parse(localStorage.getItem('ticket'));
				if (!myTicket) {
					return;
				}
				this.ticketsService.myTicket = myTicket;

				let idTicket = myTicket._id;
				let oldSocket: string;
				let newSocket = this.idSocket;

				if (localStorage.getItem('desktop')) {
					oldSocket = myTicket.id_socket_desk;
				} else {
					oldSocket = myTicket.id_socket;
				}

				this.ticketsService.actualizarSocket(idTicket, oldSocket, newSocket).pipe(
					catchError(this.manejaError)
				).subscribe((data: any) => {
					if (data.ok) {
						
						// entra a la sala de la empresa asignada en el ticket
						this.emit('enterCompany', data.ticket.id_company);

						// si actualizo el ticket en la BD actualizo en myTicket y en la LS
						if (localStorage.getItem('desktop')) {
							this.ticketsService.myTicket.id_socket_desk = this.idSocket;
						} else {
							this.ticketsService.myTicket.id_socket = this.idSocket;
						}

						localStorage.setItem('ticket', JSON.stringify(this.ticketsService.myTicket));
					}
				});
			}
			this.socketStatus = true;
		});

		this.socket.on('disconnect', () => {
			this.snack.open('Desconectado del servidor de turnos.', null, { duration: 2000 });
			this.socketStatus = false;
		});
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

	escucharActualizarTicket(): void {
		this.listen('ticket-updated').subscribe((data: any ) => {
			this.snack.open('Se actualizo la sesión remota', null, {duration:1000});
			this.ticketsService.myTicket = data.ticket;
			localStorage.setItem('ticket', JSON.stringify(data.ticket));
		});
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
