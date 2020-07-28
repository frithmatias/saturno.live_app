import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
	selector: 'app-home-user',
	templateUrl: './home-user.component.html',
	styleUrls: [ './home-user.component.css' ],
	providers: [{
		provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
	}]
})
export class HomeUserComponent implements OnInit {
	publicURL: string;
	constructor(public userService: UserService) {}
	ngOnInit() {
		this.publicURL = `https://webturnos.herokuapp.com/#/public/${this.userService.usuario.id_company.tx_public_name}`;
	}
}
