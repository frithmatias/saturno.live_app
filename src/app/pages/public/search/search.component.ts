import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {

  }
  ngAfterViewInit(){
    let refInput = document.getElementById('inputCompany');
       refInput.focus();
  }
  
  findCompany(e: HTMLInputElement){

    if(e.value.length>0){
      this.router.navigate(['/public', e.value]);
    }
  }

}
