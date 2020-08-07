import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper/stepper';
import { Company, CompaniesResponse } from '../../../interfaces/company.interface';
import { User } from 'src/app/interfaces/user.interface';

@Component({
	selector: 'app-home-user',
	templateUrl: './home-user.component.html',
	styleUrls: ['./home-user.component.css'],
	providers: [{
		provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
	}]
})
export class HomeUserComponent implements OnInit {
	@ViewChild('stepper') stepper: MatStepper;
	publicURL: string;
	showIntro: boolean = true;
	config: any = {};
	user: User;
	constructor(public userService: UserService) { }
	ngOnInit() {
		if (this.userService.user) { this.user = this.userService.user; }

		this.userService.user$.subscribe(data => {
			if (data) {
			  this.user = data;
			}
		});

		if (localStorage.getItem('config')) {
			this.config = JSON.parse(localStorage.getItem('config'));
			this.showIntro = this.config.intro;
		}

	}

	toggleIntro() {
		this.config.intro = !this.showIntro;
		localStorage.setItem('config', JSON.stringify(this.config));
	}

	endWizard() {
		this.config.intro = false;
		this.showIntro = false;
		localStorage.setItem('config', JSON.stringify(this.config));
	}
}
