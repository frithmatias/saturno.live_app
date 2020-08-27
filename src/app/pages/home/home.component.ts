import { Component, OnInit } from '@angular/core';
import { TicketsService } from '../../services/tickets.service';
import moment from 'moment';
import { timer, interval } from 'rxjs';
import { tap, map } from 'rxjs/operators';
moment.locale('es');
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  date: string;
  constructor(public ticketsService: TicketsService) {}

  ngOnInit(): void {

    let timer$ = interval(1000);
    
    timer$.pipe(map(data =>  new Date().getTime() )).subscribe(data => {
      this.date = moment().format('LL H:mm:ss');
      
    })
  }

}
