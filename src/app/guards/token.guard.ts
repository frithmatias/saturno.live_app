import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenGuard implements CanActivate {

	constructor(
		public userService: UserService,
		public router: Router
	) { }

	// verifica primero si expiro el token, si expiro devuelve false y lo manda al login
	// si no expiro verifica si tiene que renovar (es cuando defino un tiempo proximo a vencer)
	// si tiene que renovar devuelve true y sino, devuelve false.
	canActivate(): Promise<boolean> | boolean {

		const token = this.userService.token;

		if (!token) {
			this.userService.logout();
			this.router.navigate(['/home']);
			return false;
		}

		const payload = JSON.parse(atob(token.split('.')[1]));
		const expirado = this.expirado(payload.exp);

		if (expirado) {
			this.userService.logout();
			this.router.navigate(['/home']);
			return false;
		}

		// el token no expiro, pero vierifica si esta próximo a vencer para renovar.
		return this.verificaRenueva(payload.exp);
	}

	verificaRenueva(fechaExp: number): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const tokenExp = new Date(fechaExp * 1000);
			const ahora = new Date();
			const renueva = new Date();
			
			// 1 hora
			renueva.setTime(ahora.getTime() + (1 * 60 * 60 * 1000));

			const difRenueva = tokenExp.getTime() - renueva.getTime();
			const difExpira = tokenExp.getTime() - ahora.getTime();

			if (tokenExp.getTime() > renueva.getTime()) {
				
				// no es necesario renovar
				const horaRenueva = (difRenueva / 1000 / 3600).toFixed(3).split('.');
				const horaExpira = (difExpira / 1000 / 3600).toFixed(3).split('.');

				const minRenueva = String(Number(horaRenueva[1]) * 60 / 1000).split('.');
				const minExpira = String(Number(horaExpira[1]) * 60 / 1000).split('.');

				const segRenueva = Number(minRenueva[1]) * 60 / 100;
				const segExpira = Number(minExpira[1]) * 60 / 100;

				resolve(true);
			} else {

				// debe renovar
				this.userService.updateToken()
					.subscribe(() => {
						resolve(true);
					}, () => {
						this.userService.logout();
						this.router.navigate(['/home']);
						reject(false);
					});
			}
		});
	}

	expirado(fechaExp: number) {
		const ahora = new Date().getTime() / 1000;
		if (fechaExp < ahora) {
			return true;
		} else {
			return false;
		}
	}
}
