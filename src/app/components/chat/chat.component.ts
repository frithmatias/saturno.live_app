import { Component, OnInit, Output, EventEmitter, Input, SimpleChange } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TicketsService } from '../../services/tickets.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() chatOpenStatus: boolean;
  @Output() unreadMessages: EventEmitter<number> = new EventEmitter();

  chatOpen: boolean;
  constructor(
    private wsService: WebsocketService, 
    private snack: MatSnackBar, 
    private activatedRoute: ActivatedRoute,
    public ticketsService: TicketsService
    ) {
		this.activatedRoute.params.subscribe((data) => {
			console.log(data);
		});
  }

  ngOnChanges(changes: any) {
    this.chatOpen = changes.chatOpenStatus.currentValue;
    if(this.chatOpen){
      for(let message of this.ticketsService.chatMessages){
        message.viewed = true;
      }
    }
  }
  
  ngOnInit(): void {
    this.wsService.escucharMensajes().subscribe((data: any) => {
      let message = {
        own: false,
        time: new Date(),
        message: data.mensaje,
        viewed: this.chatOpen ? true : false,
      }
      this.ticketsService.chatMessages.push(message);
      if(!this.chatOpen){
        let numUnread = this.ticketsService.chatMessages.filter(message => message.viewed === false).length;
        this.unreadMessages.emit(numUnread);
      } else {
        this.scrollTop();
      }
    })
  }

  sendMessage(message: HTMLTextAreaElement, chatref: HTMLElement): void {
    if (!this.wsService.idSocket) {
      this.snack.open('Se perdió la conexión con el escritorio.', 'ACEPTAR', { duration: 5000 });
      return;
    }

    if (message.value.length > 0) {
      this.ticketsService.chatMessages.push({
        own: true,
        time: new Date(),
        message: message.value,
        viewed: true
      });
      this.wsService.emit('mensaje-privado', { mensaje: message.value });
      this.scrollTop();
      message.value = '';
      message.focus();
    }
  }

  scrollTop(): void {
    // espero 100ms por la demora del template en renderear los mensajes.
    const interval$ = timer(100).subscribe(() => {
      const chatref = document.getElementById('chatmessages');
      chatref.scrollTop = chatref.scrollHeight - chatref.clientHeight;
    })
  }

}
