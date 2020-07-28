import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { environment } from 'src/environments/environment';

import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

declare const gapi: any;
// 
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	email: string;
	hidepass = true;
	recuerdame = false;
	auth2: any; // info de google con el token

	constructor(
		public router: Router,
		public activatedRoute: ActivatedRoute,
		public userService: UserService,
		private snack: MatSnackBar
	) { }

	ngOnInit() {
		this.googleInit();
	}

	// ==========================================================
	// LOGIN GOOGLE
	// ==========================================================

	googleInit() {
		gapi.load('auth2', () => {
			this.auth2 = gapi.auth2.init({
				client_id: environment.gapi_uid,
				cookiepolicy: 'single_host_origin',
				scope: 'profile email'
			});
			this.attachSignin(document.getElementById('btnGoogle'));
		});
	}

	attachSignin(element) {
		this.auth2.attachClickHandler(element, {}, googleUser => {
			const token = googleUser.getAuthResponse().id_token;
			// googleUser google user data
			this.userService.loginGoogle(token).subscribe(
				data => {
					window.location.href = '#/cliente';
				},
				err => Swal.fire('Error', err.error.mensaje, 'error')
			);
		});
	}

	// ==========================================================
	// LOGIN NORMAL 
	// ==========================================================
	// TODO: Rehacer el formulario con formbuilder.

	login(forma: NgForm) {
		if (forma.invalid) {
			return;
		}

		const usuario: any = {
			tx_name: null,
			tx_email: forma.value.email,
			tx_password: forma.value.password,
			id_company: null
		};

		this.userService.loginUser(usuario, forma.value.recuerdame).subscribe(
			data => {
				this.router.navigate(['/user']);
			},
			err => {
				this.snack.open(err.error.msg , 'Aceptar', {duration: 5000});
			});
	}

	cleanEmail(elementEmail, elementPassword) {
		elementEmail.value = null;
		elementPassword.value = null;
		if (localStorage.getItem('email')) {
			localStorage.removeItem('email');
		}
	}

}
