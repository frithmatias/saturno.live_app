import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent implements OnInit {
  opened: boolean;
  unreadMessages: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    public ticketsService: TicketsService
  ) {}

  ngOnInit(): void {

    if (localStorage.getItem('ticket')) {
      this.ticketsService.myTicket = JSON.parse(localStorage.getItem('ticket'));
      this.router.navigate(['/public/screen']);

      if (this.ticketsService.myTicket.tm_end) { // si el ticket esta finalizado limpio la sesión
        this.ticketsService.clearPublicSession();
      }
    } 

    if (localStorage.getItem('company')) {
      if (!this.ticketsService.companyData){
        this.ticketsService.companyData = JSON.parse(localStorage.getItem('company'));
      }
    };

    this.route.params.subscribe((data: any) => {
      // /public/nombreEmpresa

      if (data.userCompanyName) {
        this.ticketsService.readCompany(data.userCompanyName).subscribe((resp: any) => {
          if (resp.ok) {
            localStorage.setItem('company', JSON.stringify(resp.company));
            this.ticketsService.companyData = resp.company;
            this.router.navigate(['/public/tickets'])
          }

        },
          (err) => {
            this.snack.open('No existe la empresa ingresada', 'Aceptar', { duration: 2000 });
            this.router.navigate(['/public'])
          }
        );
      }

    });

  }

  toggle(htmlRef: MatSidenav): void {
    htmlRef.toggle();
  }
}
