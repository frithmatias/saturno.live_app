import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper/stepper';

@Component({
	selector: 'app-home-user',
	templateUrl: './home-user.component.html',
	styleUrls: [ './home-user.component.css' ],
	providers: [{
		provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
	}]
})
export class HomeUserComponent implements OnInit {
	@ViewChild('stepper') stepper: MatStepper;
	publicURL: string;
	showIntro: boolean = true;
	config: any = {};
	selectedIndex: number;
	constructor(public userService: UserService) {}
	ngOnInit() {

		if (localStorage.getItem('config')) {
			this.config = JSON.parse(localStorage.getItem('config'));
			this.showIntro = this.config.intro;
		}

		// this.publicURL = `https://webturnos.herokuapp.com/#/public/${this.userService.usuario.id_company?.tx_public_name}`;
		this.publicURL = `https://webturnos.herokuapp.com/#/public/sucomercio`;

	}

	toggleIntro(){
		this.config.intro = !this.showIntro;
		localStorage.setItem('config', JSON.stringify(this.config));
	}
}
