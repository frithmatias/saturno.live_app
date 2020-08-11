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

  user: User;
  userSubscription: Subscription;

  companies: Company[];
  companiesSubscription: Subscription;
  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.user = this.userService.user;
    if (this.user) {
      this.readCompanies();
      // subscriptions
    }
    this.userSubscription = this.userService.user$.subscribe((user: User) => {
      this.user = user;
      this.readCompanies();
    });
    this.companiesSubscription = this.userService.companies$.subscribe((data: Company[]) => {
      this.companies = data;
    })
  }

  readCompanies(): void {
    if (this.user) {
      let idUser = this.user._id;
      this.userService.readCompanies(idUser).subscribe((data: CompaniesResponse) => {
        this.companies = data.companies;
      });
    }
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
