import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Desktop, DesktopsResponse} from 'src/app/interfaces/desktop.interface';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  desktops: Desktop[] = [];
  constructor(
    private router: Router,
    private userService: UserService,
    private snack: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.userService.readDesktops(this.userService.usuario.id_company).subscribe((data: DesktopsResponse) => {
      console.log(data);
      this.desktops = data.desktops;
      
    });
   }

  
  
  entrar(idDesktop: string): void {

    if (!idDesktop) {
      return;
    }

    let idCompany = this.userService.usuario.id_company;
    let idAssistant = this.userService.usuario._id;

    this.userService.takeDesktop(idCompany, idDesktop, idAssistant).subscribe(data => {
      console.log(data);
    })
    this.router.navigate(['/asistente/escritorio', idDesktop]);
  }
}
