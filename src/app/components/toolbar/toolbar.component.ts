import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TicketsService } from '../../services/tickets.service';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Output() toggleSideNav: EventEmitter<boolean> = new EventEmitter();
  @Output() toggleChat: EventEmitter<boolean> = new EventEmitter();
  @Input() unreadMessages: number;
  hiddenBadge: boolean;
  user: User;
  constructor(
    public userService: UserService,
    public ticketsService: TicketsService,
    public router: Router
    ) { }

  ngOnInit(): void { 
    this.user = this.userService.user;
    this.userService.user$.subscribe(data => {
      this.user = data;
    })
  }

  ngOnChanges(changes: any) {
    this.hiddenBadge = false;
  }

  toggle(component: string): void {
    switch (component) {
      case 'sidenav':
        this.toggleSideNav.emit(true);
        break;
      case 'chat':
        this.hiddenBadge = true;
        this.toggleChat.emit(true);
        break;
    }
  }
}
