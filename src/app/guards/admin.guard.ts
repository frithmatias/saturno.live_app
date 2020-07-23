import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class AdminGuard implements CanActivate {

	constructor(
		public userService: UserService
	) { }

	canActivate() {

		if (this.userService.usuario.id_role === 'ADMIN_ROLE') {
			return true;
		} else {

			this.userService.logout();
			return false;
		}

	}

}
