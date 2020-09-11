import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable()
export class AdminGuard implements CanActivate {

	constructor(
		public loginService: LoginService,
	) { }

	canActivate() {
		if (this.loginService.user.id_role === 'ADMIN_ROLE') {
			return true;
		} else {
			this.loginService.logout();
			return false;
		}
	}

}
