import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: { me: boolean, time: Date, message: string }[] = [];

  constructor(private wsService: WebsocketService, private snack: MatSnackBar) { }

  ngOnInit(): void {
    console.log('Subscriendo a mensajes...');
    this.wsService.escucharMensajes().subscribe((data: any) => {
      this.messages.push({ 
        me: false, 
        time: new Date(), 
        message: data.mensaje 
      });
      console.log(this.messages);
    })
  }
  sendMessage(message: HTMLTextAreaElement): void {

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
      message.value = '';
    }
  }


}
