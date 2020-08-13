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

		// payload: {usuario: {…}, iat: 1597269832, exp: 1599861832}
		const payload = JSON.parse(atob(token.split('.')[1]));

		// verifica si el token expiro
		const expira = this.expira(payload.exp); // 1599861832
		if (expira) {
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

			const renueva = new Date();
			const ahora = new Date();
			// token expira en 2 horas y debe renovar 10 min antes de expirar
			renueva.setTime(ahora.getTime() + (1 * 10 * 60 * 1000)); // 10 min

			if (tokenExp.getTime() > renueva.getTime()) {
				// no es necesario renovar
				resolve(true);
				// const difRenueva = tokenExp.getTime() - renueva.getTime();
				// const horaRenueva = (difRenueva / 1000 / 3600).toFixed(3).split('.');
				// const minRenueva = String(Number(horaRenueva[1]) * 60 / 1000).split('.');
				// const segRenueva = String(Number(minRenueva[1]) * 60 / 100).split('.');
				
				// const difExpira = tokenExp.getTime() - ahora.getTime();
				// const horaExpira = (difExpira / 1000 / 3600).toFixed(3).split('.');
				// const minExpira = String(Number(horaExpira[1]) * 60 / 1000).split('.');
				// const segExpira = String(Number(minExpira[1]) * 60 / 100).split('.');
				
				// c .log( + new Date())
				// c .log('renueva', `${horaRenueva[0]}:${minRenueva[0]}:${segRenueva[0]}`);
				// c .log('expira', `${horaExpira[0]}:${minExpira[0]}:${segExpira[0]}`);
				
			} else {
				// debe renovar
				this.userService.updateToken().subscribe((resp: any) => {
					if (resp.ok) {
						resolve(true);
					} else {
						reject(false);
					}
				}, () => {
					this.userService.logout();
					reject(false);
				});
			}
		});
	}

	expira(fechaExp: number) {
		const ahora = new Date().getTime() / 1000;
		if (fechaExp < ahora) {
			return true;
		} else {
			return false;
		}
	}
}
