import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TicketsService } from '../../services/tickets.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    public userService: UserService,
    public ticketsService: TicketsService,
    public router: Router
    ) {

      console.log(this.router.url);


  }

  ngOnInit(): void { }

  ngOnChanges(changes: any) {
    this.hiddenBadge = false;
    console.log(changes);
  }

  toggle(component: string): void {
    console.log(component);
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
