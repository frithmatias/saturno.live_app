import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Desktop, DesktopsResponse, DesktopResponse } from 'src/app/interfaces/desktop.interface';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  desktops: Desktop[] = [];
  desktopsAvailable: Desktop[] = [];
  myDesktop: Desktop;
  user: User;
  constructor(
    private router: Router,
    public userService: UserService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.userService.usuario.id_company._id) {
      let idCompany = this.userService.usuario.id_company._id;
      this.readDesktops(idCompany);
    }

    this.userService.user$.subscribe(data => {
      if (data) {
        this.readDesktops(data.id_company._id);
      }
    })
  }

  takeDesktop(desktop: Desktop): void {

    if (!desktop) {
      return;
    }

    let idDesktop = desktop._id;
    let idAssistant = this.userService.usuario._id;

    this.userService.takeDesktop(idDesktop, idAssistant).subscribe((data: DesktopResponse) => {
      this.snack.open(data.msg, null, { duration: 2000 });
      if (data.ok) {
        this.userService.desktop = data.desktop;
        localStorage.setItem('desktop', JSON.stringify(data.desktop));
        this.router.navigate(['/assistant/desktop']);
      } else {
        this.snack.open('No se pudo tomar un escritorio', null, { duration: 2000 });

      }
    })
  }

  readDesktops(idCompany: string): void {
    this.userService.readDesktops(idCompany).subscribe((data: DesktopsResponse) => {
      if(data.ok){
        this.desktops = data.desktops;
        this.desktopsAvailable = this.desktops.filter(desktop => desktop.id_assistant === null);
        this.myDesktop = this.desktops.filter(desktop => desktop.id_assistant === this.userService.usuario._id)[0]
      }

      if (this.myDesktop) {
        this.userService.desktop = this.myDesktop;
        localStorage.setItem('desktop', JSON.stringify(this.myDesktop));
      } else {
        this.userService.desktop = null;
        if (localStorage.getItem('desktop')) { localStorage.removeItem('desktop'); }
      }

    });
  }

  releaseDesktop(desktop: Desktop): void {
    let idDesktop = desktop._id;
    let idCompany = this.userService.usuario.id_company._id;
    this.userService.releaseDesktop(idDesktop).subscribe(data => {
      this.readDesktops(idCompany);
    })
  }
}
