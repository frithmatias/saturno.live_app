import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Company, CompaniesResponse } from 'src/app/interfaces/company.interface';
import { UserResponse } from '../../interfaces/user.interface';
import { User } from 'src/app/interfaces/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {
  events: string[] = [];
  opened: boolean;
  companySelected: string;
  
  user: User;
  userSubscription: Subscription;

  companies: Company[];
  companiesSubscription: Subscription;
  constructor(public userService: UserService) { }

  ngOnInit(): void {

    this.user = this.userService.user;
    
    this.userSubscription = this.userService.user$.subscribe(data => {
      this.user = data;
      if(this.user){
        this.user.id_company?._id ? this.companySelected = this.user.id_company._id : 'not_assigned';
        this.userService.readCompanies(this.user._id)
      }
    })

    this.companies = this.userService.companies;
    this.userService.companies$.subscribe(data => {
      this.companies = data;
    })

  }

  attachCompany(company: Company) {
    this.userService.attachCompany(company).subscribe((data: UserResponse) => {
      // obtengo el usuario con el nuevo id_company populado
      if (data.ok) {
        this.userService.user = data.user;
        this.userService.userSource.next(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    })
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.companiesSubscription.unsubscribe();
  }

}
