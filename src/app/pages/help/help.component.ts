import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TicketsService } from '../../services/tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  constructor(
    private ticketsService: TicketsService,
    private snack: MatSnackBar) { }

  ngOnInit(): void {
  }

  enviar( f: NgForm): void {

    if (f.invalid) {
      this.snack.open('Por favor verifique los datos ingresados.', null, { duration: 2000 });
      return;
    }

    let contact = {
      tx_type: f.value.tipo,
      tx_message: f.value.comentarios,
      tx_name: f.value.nombre,
      tx_email: f.value.email,
      tx_phone: f.value.telefono,
    }
    
    this.ticketsService.sendContact(contact).subscribe( (resp: any) => {
      f.reset();
      this.snack.open(`Gracias, su mensaje fue recibido correctamente.`, null, { duration: 5000 });
    })
  }


}
