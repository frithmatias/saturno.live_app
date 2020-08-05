import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Company } from 'src/app/interfaces/company.interface';
import { UserResponse } from '../../interfaces/user.interface';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  events: string[] = [];
  opened: boolean;
  constructor(public userService: UserService) { }
  
  ngOnInit(): void {
  }

  companySelected(company: Company){
    this.userService.attachCompany(company).subscribe((data: UserResponse) => {
      this.userService.usuario = data.user;
      localStorage.setItem('user', JSON.stringify(data.user));
    })
  }



}
