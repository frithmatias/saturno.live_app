import { Injectable } from '@angular/core';
import { CanActivate  } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable()
export class LoginGuard implements CanActivate {

	constructor(
		public LoginService: LoginService,
	) { }

	canActivate() {
		if (this.LoginService.user) {
			return true;
		} else {
			return false;
		}
	}
}
