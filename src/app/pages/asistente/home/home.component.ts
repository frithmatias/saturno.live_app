import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Desktop } from 'src/app/interfaces/desktop.interface';
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

   }

  
  
  entrar(numero: number): void {
    if (!numero) {
      return;
    }
    this.router.navigate(['/asistente/escritorio', numero]);
  }
}
