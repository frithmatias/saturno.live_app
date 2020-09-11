import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Company, CompaniesResponse, CompanyResponse } from '../../../interfaces/company.interface';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  companies: Company [] = [];
  companySelected: Company;

  constructor(
    private router: Router,
    private publicService: PublicService,
    private snack: MatSnackBar) { }

  ngOnInit(): void {}
  ngAfterViewInit() {
    let refInput = document.getElementById('inputCompany');
    refInput.focus();
  }

  findCompany(e: HTMLInputElement) {

    if (e.value.length > 1) {
      this.publicService.findCompany(e.value).subscribe((data: CompaniesResponse) => {
        if (data.ok) {
          this.companies = data.companies;
        } else {
          e.value = '';
          this.snack.open('No existen resultados.', null, { duration: 1000 });
        }
      }, () => {
        this.snack.open('Error al obtener las empresas', null, { duration: 2000 });
      })
      // this.router.navigate(['/public', e.value]);
    }
  }
  goToCompany(): void {
    if(this.companySelected){
      localStorage.setItem('company', JSON.stringify(this.companySelected));
      this.publicService.company = this.companySelected;
      this.router.navigate(['/public/', this.companySelected.tx_public_name]);
    }
  }
  setCompany(e: any):void {
    this.companySelected = e;
  }

  cleanInput(inputCompany) {
		inputCompany.value = null;
	}

}
