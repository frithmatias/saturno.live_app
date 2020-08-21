import { Component, OnInit } from '@angular/core';
import { TicketsService } from '../../services/tickets.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private ticketsService: TicketsService) {}

  ngOnInit(): void {}

}
