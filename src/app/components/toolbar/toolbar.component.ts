import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  unreadMessages: number = 12;
  @Output() toggleSideNav: EventEmitter<boolean> = new EventEmitter();
  @Output() toggleChat: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  toggle(component: string): void {
    switch (component) {
      case 'sidenav':
        this.toggleSideNav.emit(true);
        break;
      case 'chat':
        this.unreadMessages = 0;
        this.toggleChat.emit(true);
        break;
    }


  }
}
