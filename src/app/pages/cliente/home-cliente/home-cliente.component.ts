import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home-cliente',
	templateUrl: './home-cliente.component.html',
	styleUrls: [ './home-cliente.component.css' ]
})
export class HomeClienteComponent implements OnInit {
	constructor(private router: Router) {}

	ngOnInit() {}


}
