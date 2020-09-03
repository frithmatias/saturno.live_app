import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ticket } from '../interfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  tickets: Ticket[] = [];
  constructor(private http: HttpClient) { }

  pushTicket(ticket: Ticket): void {
    this.tickets.push(ticket);
  }

  setScore(idDesktopSession: string, score: number): void {
  }

  drawerScrollTop(): void {
    let ref = document.getElementsByClassName('mat-drawer-content')[0];
		ref.scrollTop = 0;
  }

}
