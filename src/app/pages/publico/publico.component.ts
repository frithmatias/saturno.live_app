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
    this.ticketsService.userPreset = true;
  }

  ngOnInit(): void {
    this.route.params.subscribe((data: any) => {
      // /publico/nombreEmpresa

      if (data.userCompanyName) {
        this.ticketsService.getUserData(data.userCompanyName).subscribe((resp: any) => {

          if (resp.ok) {
            this.ticketsService.companyData = resp.user;
            this.ticketsService.getTickets();
            localStorage.setItem('company', JSON.stringify(resp.user));
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
