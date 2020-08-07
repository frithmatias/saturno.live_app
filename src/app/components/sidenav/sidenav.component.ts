import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Company, CompaniesResponse } from 'src/app/interfaces/company.interface';
import { UserResponse } from '../../interfaces/user.interface';
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  events: string[] = [];
  opened: boolean;
  user: User;
  companies: Company[];
  constructor(public userService: UserService) { }

  ngOnInit(): void {


    this.user = this.userService.user;
    this.userService.user$.subscribe(data => {
      this.user = data;
    })


    if(this.user){
      this.userService.readCompanies(this.user._id)
      this.companies = this.userService.companies;
      this.userService.companies$.subscribe(data => {
        this.companies = data;
      })
    }
  }

  companySelected(company: Company) {
    this.userService.attachCompany(company).subscribe((data: UserResponse) => {
      // obtengo el usuario con el nuevo id_company populado
      if (data.ok) {
        this.userService.user = data.user;
        this.userService.userSource.next(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    })
  }


}
