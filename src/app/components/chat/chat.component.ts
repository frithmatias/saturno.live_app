import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, timer } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: { me: boolean, time: Date, message: string }[] = [];

  constructor(private wsService: WebsocketService, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.wsService.escucharMensajes().subscribe((data: any) => {
      this.messages.push({ 
        me: false, 
        time: new Date(), 
        message: data.mensaje 
      });
      this.scrollTop();
    })
  }
  sendMessage(message: HTMLTextAreaElement, chatref: HTMLElement): void {

    if (!this.wsService.idSocket) {
			this.snack.open('Se perdió la conexión con el escritorio.', 'ACEPTAR', { duration: 5000 });
			return;
    }
    
		if (message.value.length > 0) {
      this.messages.push({ 
        me: true, 
        time: new Date(), 
        message: message.value 
      });
      this.wsService.emit('mensaje-privado', { mensaje: message.value });
      this.scrollTop();
      message.value = '';
      message.focus();
    }
  }

  scrollTop(): void {
    // espero 100ms por la demora del template en renderear los mensajes.
    const interval$ = timer(100).subscribe(()=> {
      const chatref = document.getElementById('chatmessages');
      chatref.scrollTop = chatref.scrollHeight - chatref.clientHeight;
    })
  }

}
