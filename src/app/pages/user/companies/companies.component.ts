import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/interfaces/company.interface';
import { UserService } from '../../../services/user.service';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { CompanyResponse, CompaniesResponse } from '../../../interfaces/company.interface';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  companies: Company[];
  companyEdit: Company;  // company enviada al child
  companyUpdated: Company; // company recibida del child
  constructor(
    private userService: UserService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.readCompanies();
  }
  
  editCompany(company: Company): void {
    this.companyEdit = company
  }

  newCompany(company: Company): void {
    this.companyUpdated = company;
    this.readCompanies();
  }
  
  deleteCompany(idCompany: string): void {
    this.snack.open('Desea eliminar el asistente?', 'ELIMINAR', {duration: 10000}).afterDismissed().subscribe((data: MatSnackBarDismiss) => {
      if(data.dismissedByAction){
        this.userService.deleteCompany(idCompany).subscribe((data: CompanyResponse) => {
          this.snack.open(data.msg, null, { duration: 2000 });
          this.companies = this.companies.filter(company => company._id != idCompany);
          this.userService.companies = this.companies;
          if(idCompany === this.userService.usuario.id_company?._id){
            this.userService.usuario.id_company = null;
            localStorage.setItem('user', JSON.stringify(this.userService.usuario));
          }
        },(err: CompanyResponse) => {
            this.snack.open(err.msg, null, { duration: 2000 });
          }
        )
      }
    })
  }

  readCompanies(): void {
    let idUser = this.userService.usuario._id;
    this.userService.readCompanies(idUser).subscribe((data: CompaniesResponse) => {
      this.companies = data.companies;
      this.userService.companies = data.companies;
    });
  }
}
