import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-publico',
  templateUrl: './publico.component.html',
  styleUrls: ['./publico.component.css']
})
export class PublicoComponent implements OnInit {
  opened: boolean;
  unreadMessages: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    public ticketsService: TicketsService
  ) {
    this.ticketsService.publicMode = true;
  }

  ngOnInit(): void {

    if (localStorage.getItem('ticket')) {
      this.ticketsService.myTicket = JSON.parse(localStorage.getItem('ticket'));
      this.router.navigate(['/publico/pantalla']);

      if (this.ticketsService.myTicket.tm_end) { // si el ticket esta finalizado limpio la sesión
        this.ticketsService.clearPublicSession();
      }
    } 

    if (localStorage.getItem('company')) {
      this.ticketsService.companyData = JSON.parse(localStorage.getItem('company'));
      this.router.navigate(['/publico/turnos']);
    };

    this.route.params.subscribe((data: any) => {
      // /publico/nombreEmpresa

      if (data.userCompanyName) {
        this.ticketsService.readCompany(data.userCompanyName).subscribe((resp: any) => {
          if (resp.ok) {
            localStorage.setItem('company', JSON.stringify(resp.company));
            this.ticketsService.companyData = resp.company;
            this.router.navigate(['/publico/turnos'])
          }

        },
          (err) => {
            this.snack.open('No existe la empresa ingresada', 'Aceptar', { duration: 5000 });
            this.router.navigate(['/publico'])
          }
        );
      }

    });
  }
  toggle(htmlRef: MatSidenav): void {
    htmlRef.toggle();
  }
}
