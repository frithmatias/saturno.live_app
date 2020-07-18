import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class AdminGuard implements CanActivate {

	constructor(
		public userService: UserService
	) { }

	canActivate() {
		console.log(this.userService.usuario);
		if (this.userService.usuario.id_role === 'ADMIN_ROLE') {
			return true;
		} else {
			console.log('No es admin');
			this.userService.logout();
			return false;
		}

	}

}
