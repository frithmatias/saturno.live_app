import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TicketsService } from '../../../services/tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Company, CompanysResponse, CompanyResponse } from '../../../interfaces/company.interface';

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
    private ticketsService: TicketsService,
    private snack: MatSnackBar) { }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    let refInput = document.getElementById('inputCompany');
    refInput.focus();
  }

  findCompany(e: HTMLInputElement) {

    if (e.value.length > 1) {
      this.ticketsService.findCompany(e.value).subscribe((data: CompanysResponse) => {
        if (!data.ok) {
          e.value = '';
          this.snack.open('No existen resultados.', null, { duration: 1000 });
        } else {
          console.log(data);
          this.companies =  data.companies;
        }
      }, () => {
        this.snack.open('Ocurrio un error al buscar la empresa', null, { duration: 2000 });
      })
      // this.router.navigate(['/public', e.value]);
    }
  }
  goToCompany(): void {
    if(this.companySelected){
      this.router.navigate(['/public/', this.companySelected.tx_public_name]);
    }
  }
  setCompany(e: any):void {
    console.log(e);
    this.companySelected = e;
  }

}
