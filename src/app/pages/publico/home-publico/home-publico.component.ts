import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-publico',
  templateUrl: './home-publico.component.html',
  styleUrls: ['./home-publico.component.css']
})
export class HomePublicoComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  findCompany(e: HTMLInputElement){
    console.log(e.value);
    if(e.value.length>0){
      this.router.navigate(['/publico', e.value]);
    }
  }

}
