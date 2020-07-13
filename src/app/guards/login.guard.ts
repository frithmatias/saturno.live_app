import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from '../services/user.service';

@Injectable()
export class LoginGuard implements CanActivate {

	constructor(
		public userService: UserService,
		public router: Router
	) { }

	canActivate() {

		if (this.userService.logueado) {
			return true;
		} else {
			this.router.navigate(['/login']);
			return false;
		}

	}
}
