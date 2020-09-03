import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper/stepper';
import { Company, CompaniesResponse } from '../../../interfaces/company.interface';
import { User } from '../../../interfaces/user.interface';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	providers: [{
		provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
	}]
})
export class HomeComponent implements OnInit {
	@ViewChild('stepper') stepper: MatStepper;
	publicURL: string;
	showIntro: boolean = true;
	config: any = {};
	userSuscription: Subscription;
	user: User;
	userAvailable = false;	
	activateSkillExplanation = false;
	activateAssistantExplanation = false;
	constructor(public userService: UserService) { }
	ngOnInit() {
		if (this.userService.user) { this.user = this.userService.user; }

		this.userSuscription = this.userService.user$.subscribe(data => {
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

	ngOnDestroy(): void {
		this.userSuscription.unsubscribe();
	}


	scrollTop() {
		document.body.scrollTop = 0; // Safari
		document.documentElement.scrollTop = 0; // Other
  }
  
	stepperGoBack(stepper: MatStepper) {
		stepper.previous();
	}

	stepperGoNext(stepper: MatStepper) {
		this.scrollTop();
		stepper.next();
	}
	
}
