import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicService } from '../../services/public.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
showContactData = false;
  constructor(
    private publicService: PublicService,
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
    
    this.publicService.sendContact(contact).subscribe( (resp: any) => {
      f.reset();
      this.snack.open(`Gracias, su mensaje fue recibido correctamente.`, null, { duration: 5000 });
    })
  }


}
