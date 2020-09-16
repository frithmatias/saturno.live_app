import { Component, OnInit } from '@angular/core';
import { SuperuserService } from '../superuser.service';
import { MenuResponse, Menu, MenusResponse } from '../superuser.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menus: Menu[] = [];
  menuEdit: Menu;
  idMenuUpdated: string;
  constructor(private superuserService: SuperuserService) { }

  ngOnInit(): void {
    this.readMenus();
  }

  editMenu(menu: Menu): void {
    this.menuEdit = menu;
  }

  // menu was created or updated
  menuUpdated(idMenuUpdated: string): void {
    this.idMenuUpdated = idMenuUpdated;
    this.readMenus();
  }

  readMenus(): void {
    this.superuserService.readMenus().subscribe((data: MenusResponse) => {
      this.menus = data.menu;
    })
  }

}
