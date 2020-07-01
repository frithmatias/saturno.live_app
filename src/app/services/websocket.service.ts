import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, of } from 'rxjs';
import { TicketsService } from './tickets.service';
import { AjaxError } from 'rxjs/ajax';
import { catchError } from 'rxjs/operators';
import { Ticket } from '../interfaces/ticket.interface';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {
	public socketStatus = false;
	public usuario = null;
	public idSocket = null;
	constructor(private socket: Socket, private ticketsService: TicketsService) {
		this.checkSocket();
		this.escucharSockets();
	}

	escucharSockets(): void {
		this.listen('actualizar-pantalla').subscribe((data: any) => {
			this.ticketsService.getTickets();
			const audio = new Audio();
			audio.src = '../../assets/new-ticket.mp3';
			audio.load();
			audio.play();
		});
	}

	checkSocket(): void {
		this.socket.on('connect', () => {
			this.idSocket = this.socket.ioSocket.id;
			// si había un ticket en la LS lo actualizo
			if ( localStorage.getItem('turno')) {
				console.log('actualizando socket en ls: ', this.idSocket);
				const myTicket: Ticket = JSON.parse(localStorage.getItem('turno'));
				this.updateSocket(myTicket.id_socket, this.idSocket);
			}
			this.socketStatus = true;
		});

		this.socket.on('disconnect', () => {
			console.log('Desconectado del servidor');
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
		this.ticketsService.myTicket = null;
		localStorage.removeItem('turno');
		return of<AjaxError>(err);  // <b
	}

	updateSocket(oldSocket: string, newSocket: string): void {
		this.ticketsService.actualizarSocket(oldSocket, newSocket).pipe(
			catchError(this.manejaError)
		).subscribe((data: any) => {
			if (data.ok) {
				// si lo actualizo ok en backend actualizo en LS
				this.ticketsService.myTicket.id_socket = this.idSocket;
				localStorage.setItem('turno', JSON.stringify(this.ticketsService.myTicket));
			}
		});
	}

}
