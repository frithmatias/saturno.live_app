import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	token: string;
	usuario: User;
	menu: any[] = [];
	logueado = false;

	constructor(private http: HttpClient, private router: Router) {
		console.log(environment.url);
	}

	registerUser(usuario: User) {
		console.log(usuario);
		const url = environment.url + '/u/register';
		return this.http.post(url, usuario);
	}

	getUser(uid: string) {
		const url = environment.url + '/usuarios/' + uid;
		const headers = new HttpHeaders({
			'x-token': this.token
		});
		return this.http.get(url, { headers }).pipe(
			map((resp: any) => {
				return resp.usuario;
			})
		);
	}

	updateUser(usuario: User) {
		const url = environment.url + '/usuarios/' + usuario._id;

		const headers = new HttpHeaders({
			'x-token': this.token
		});

		return this.http.put(url, usuario, { headers }).pipe(
			map((resp: any) => {
				// this.usuario = resp.usuario;
				const usuarioDB: User = resp.usuario;

				// los datos estan actualizados en la bd, pero no voy a ver los cambios
				// si no actualizo los datos en la localstorage

				// Este if es porque SOLO guardo los datos en la localstorage si estoy
				// actualizando datos PROPIOS. Si soy ADMIN y estoy cambiando datos en
				// la lista de usuarios NO tengo que guardar nada en la localstorage.
				if (usuario._id === this.usuario._id) {
					this.setStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
				}

				Swal.fire('Usuario actualizado', usuario.nombre, 'success');

				return true;
			}),
			// seccion 17 clase 222, capturo el error con throwError en PROFILE.COMPONENT.TS
			catchError(err => {
				return throwError(err);
			})
		);
	}

	deleteUser(id: string) {
		const url = environment.url + '/usuarios/' + id;

		const headers = new HttpHeaders({
			'x-token': this.token
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
		const url = environment.url + '/usuarios/activate/' + id;
		return this.http.get(url)
			.pipe(map(data => {
				return data;
			}),
				catchError(err => {
					return throwError(err);
				})
			)
	}

	loginUser(usuario: User, recordar: boolean = false) {
		if (recordar) {
			localStorage.setItem('email', usuario.email);
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
			'x-token': this.token
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
		if (payload.exp < ahora) {
			this.logout();
			return false; // token expirado
		} else {
			return true; // token valido
		}
	}

	loadStorage() {
		if (localStorage.getItem('token')) {
			this.token = localStorage.getItem('token');
			this.usuario = JSON.parse(localStorage.getItem('usuario'));
			this.menu = JSON.parse(localStorage.getItem('menu'));
		} else {
			this.token = '';
			this.usuario = null;
			this.menu = [];
		}
	}

	setStorage(id: string, token: string, usuario: User, menu: any) {
		localStorage.setItem('token', token);
		localStorage.setItem('usuario', JSON.stringify(usuario));
		localStorage.setItem('menu', JSON.stringify(menu));

		this.usuario = usuario;
		this.token = token;
		this.menu = menu;
	}

	logout() {
		this.usuario = null;
		this.token = '';
		this.menu = [];
		this.logueado = false;

		localStorage.removeItem('token');
		localStorage.removeItem('usuario');
		localStorage.removeItem('menu');

		this.router.navigate(['/home']);
	}
}
