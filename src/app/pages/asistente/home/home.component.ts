import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Desktop, DesktopsResponse, DesktopResponse } from 'src/app/interfaces/desktop.interface';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  desktops: Desktop[] = [];
  desktopsAvailable: Desktop[] = [];
  myDesktop: Desktop;
  constructor(
    private router: Router,
    private userService: UserService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.obtenerEscritorios();
  }



  entrar(desktop: Desktop): void {

    if (!desktop) {
      return;
    }

    let idDesktop = desktop._id;
    let idCompany = this.userService.usuario.id_company;
    let idAssistant = this.userService.usuario._id;

    this.userService.takeDesktop(idCompany, idDesktop, idAssistant).subscribe((data: DesktopResponse) => {
      this.snack.open(data.msg, null, { duration: 2000 });
      if (data.ok) {
        this.userService.desktop = data.desktop;
        localStorage.setItem('desktop', JSON.stringify(data.desktop));
        this.router.navigate(['/asistente/escritorio', desktop.cd_desktop]);
      } else {
        this.snack.open('No se pudo tomar un escritorio', null, { duration: 2000 });

      }
    })
  }

  obtenerEscritorios(): void {
    this.userService.readDesktops(this.userService.usuario.id_company).subscribe((data: DesktopsResponse) => {

      this.desktops = data.desktops;
      this.desktopsAvailable = this.desktops.filter(desktop => desktop.id_assistant === null);
      this.myDesktop = this.desktops.filter(desktop => desktop.id_assistant === this.userService.usuario._id)[0]

      if (this.myDesktop) {
        this.userService.desktop = this.myDesktop;
        localStorage.setItem('desktop', JSON.stringify(this.myDesktop));
      } else {
        this.userService.desktop = null;
        if (localStorage.getItem('desktop')) { localStorage.removeItem('desktop'); }
      }

    });
  }

  finalizar(desktop: Desktop): void {
    this.userService.releaseDesktop(desktop).subscribe(data => {
      this.obtenerEscritorios();
    })
  }
}
