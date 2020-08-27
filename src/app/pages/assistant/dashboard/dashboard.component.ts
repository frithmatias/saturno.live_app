import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';
import { MetricService } from '../../../services/metric.service';
import { UserService } from 'src/app/services/user.service';
import { Ticket } from 'src/app/interfaces/ticket.interface';
import { TicketsResponse } from '../../../interfaces/ticket.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = false;
  tickets: Ticket[] = [];
  date = new Date();
  constructor(
    private metricService: MetricService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  setDate(e: MatDatepickerInputEvent<Date>): void {
    this.loading = true;
    let idUser = this.userService.user._id;
    this.metricService.getTickets(idUser).subscribe((data: TicketsResponse) => {
      if (data.ok) {
        this.tickets = data.tickets;
        this.loading = false;
      }
    },()=>{this.loading = false;})

  }



}
