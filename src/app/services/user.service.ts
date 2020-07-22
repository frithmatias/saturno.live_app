import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

// Interfaces
import { Desktop } from 'src/app/interfaces/desktop.interface';
import { Skill } from '../interfaces/skill.interface';
import { User } from 'src/app/interfaces/user.interface';
import { Company } from '../interfaces/company.interface';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	token: string;
	usuario: User;
	menu: any[] = [];
	logueado = false;

	constructor(private http: HttpClient, private router: Router) {

		if (localStorage.getItem('token') && localStorage.getItem('user') && localStorage.getItem('menu')) {
			this.token = localStorage.getItem('token');
			this.usuario = JSON.parse(localStorage.getItem('user'));
			this.menu = JSON.parse(localStorage.getItem('menu'));
			this.logueado = true;
		} 
	}


	// ========================================================
	// User Methods
	// ========================================================

	registerUser(company: Company, user: User) {
		let data = {company, user};
		const url = environment.url + '/u/register';
		return this.http.post(url, data);
	}

	getUser(uid: string) {
		const url = environment.url + '/u/usuarios/' + uid;
		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		return this.http.get(url, { headers }).pipe(
			map((resp: any) => {
				return resp.usuario;
			})
		);
	}

	updateUser(usuario: User) {
		const url = environment.url + '/u/usuarios/' + usuario._id;

		const headers = new HttpHeaders({
			'turnos-token': this.token
		});

		return this.http.put(url, usuario, { headers }).pipe(
			map((resp: any) => {
				this.usuario = resp.usuario;
				const usuarioDB: User = resp.usuario;

				if (usuario._id === this.usuario._id) {
					this.setStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
				}

				Swal.fire('Usuario actualizado', usuario.tx_name, 'success');

				return true;
			}),
			// seccion 17 clase 222, capturo el error con throwError en PROFILE.COMPONENT.TS
			catchError(err => {
				return throwError(err);
			})
		);
	}

	deleteUser(id: string) {
		const url = environment.url + '/u/' + id;

		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		// url += '?token=' + this.token;

		return this.http.delete(url, { headers }).pipe(
			map(resp => {
				Swal.fire(
					'Usuario borrado',
					'El usuario a sido eliminado correctamente',
					'success'
				);
				return true;
			})
		);
	}

	activateUser(id: string) {
		const url = environment.url + '/u/activate/' + id;
		return this.http.get(url)
			.pipe(map(data => {
				return data;
			}),
				catchError(err => {
					return throwError(err);
				})
			)
	}


	// ========================================================
	// Assistants Methods
	// ========================================================
	
	createAssistant(assistant: User) {
		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		const url = environment.url + '/a/createassistant';
		return this.http.post(url, assistant, {headers});
	}

	readAssistants(idCompany: string) {
		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		const url = environment.url + '/a/readassistants/' + idCompany;
		return this.http.get(url, {headers});
	}

	updateAssistant(assistant: User) {
		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		const url = environment.url + '/a/updateassistant';
		return this.http.post(url, assistant, {headers});
	}
	
	deleteAssistant(idAssistant: string) {
		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		const url = environment.url + '/a/deleteassistant/' + idAssistant;
		return this.http.delete(url, {headers});
	}

	// ========================================================
	// Desktop Methods
	// ========================================================

	createDesktop(desktop: Desktop) {
		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		const url = environment.url + '/d/createdesktop';
		return this.http.post(url, desktop, {headers});
	}

	readDesktops(idCompany: string) {
		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		const url = environment.url + '/d/readdesktops/' + idCompany;
		return this.http.get(url, {headers});
	}

	deleteDesktop(idDesktop: string) {
		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		const url = environment.url + '/d/deletedesktop/' + idDesktop;
		return this.http.delete(url, {headers});
	}

	takeDesktop(idCompany: string, idDesktop: string, idAssistant: string) {

		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		let data = {idCompany, idDesktop, idAssistant}
		const url = environment.url + '/d/takedesktop';
		return this.http.post(url, data, {headers});
	}
	
	releaseDesktop(idCompany: string, idDesktop: string, idAssistant: string) {

		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		let data = {idCompany, idDesktop, idAssistant}
		console.log(data);
		const url = environment.url + '/d/releasedesktop';
		return this.http.post(url, data, {headers});
	}

	// ========================================================
	// Skill Methods
	// ========================================================

	createSkill(skill: Skill) {
		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		const url = environment.url + '/s/createskill';
		return this.http.post(url, skill, {headers});
	}

	readSkills(idCompany: string) {
		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		const url = environment.url + '/s/readskills/' + idCompany;
		return this.http.get(url, {headers});
	}

	deleteSkill(idSkill: string) {
		const headers = new HttpHeaders({
			'turnos-token': this.token
		});
		const url = environment.url + '/s/deleteskill/' + idSkill;
		return this.http.delete(url, {headers});
	}


	// ========================================================
	// Session Methods
	// ========================================================


	loginUser(usuario: User, recordar: boolean = false) {
		if (recordar) {
			localStorage.setItem('email', usuario.tx_email);
		} else {
			localStorage.removeItem('email');
		}

		const url = environment.url + '/u/login';
		return this.http.post(url, usuario).pipe(
			map((resp: any) => {
				this.setStorage(resp.id, resp.token, resp.usuario, resp.menu);
				this.logueado = true;
				return true;
			}),
			// clase 222 seccion 17, manejo de errores
			catchError(err => {
				return throwError(err);
			})
		);
	}

	loginGoogle(token: string) {
		const url = environment.url + '/u/google';
		return this.http.post(url, { token }).pipe(
			map((resp: any) => {
				this.setStorage(resp.id, resp.token, resp.usuario, resp.menu);
				this.logueado = true;
				return true;
			}),
			// clase 222 seccion 17, manejo de errores
			catchError(err => {
				return throwError(err);
			})
		);
	}

	updateToken() {

		const url = environment.url + '/login/updatetoken';
		// url += '?token=' + this.token;

		const headers = new HttpHeaders({
			'turnos-token': this.token
		});

		return this.http.get(url, { headers })
			.pipe(map((resp: any) => {
				this.token = resp.token;
				localStorage.setItem('token', this.token);
			}));

	}

	estaLogueado() {
		// si no hay token el usuario no esta logueado
		if ((this.token.length < 5) || (typeof this.token === 'undefined') || (this.token === 'undefined')) {
			return false;
		}
		// si el usuario se logueo en algun momento verifico la expiracion del token
		const payload = JSON.parse(atob(this.token.split('.')[1]));
		const ahora = new Date().getTime() / 1000;
		console.log('estaLogueado', payload);
		if (payload.exp < ahora) {
			this.logout();
			return false; // token expirado
		} else {
			return true; // token valido
		}
	}

	setStorage(id: string, token: string, usuario: User, menu: any) {
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(usuario));
		localStorage.setItem('menu', JSON.stringify(menu));

		this.usuario = usuario;
		this.token = token;
		this.menu = menu;
	}

	logout() {
		if (localStorage.getItem('token')) { localStorage.removeItem('token'); }
		if (localStorage.getItem('user')) { localStorage.removeItem('user'); }
		if (localStorage.getItem('menu')) { localStorage.removeItem('menu'); }
		this.token = '';
		this.usuario = null;
		this.menu = null;
		this.logueado = false;
		this.router.navigate(['/home']);
	}
}
