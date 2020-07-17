import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user.model';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-registro',
	templateUrl: './registro.component.html',
	styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
	forma: FormGroup;

	constructor(
		private userService: UserService,
		private router: Router
	) { }

	sonIguales(campo1: string, campo2: string) {
		return (group: FormGroup) => {
			const pass1 = group.controls[campo1].value;
			const pass2 = group.controls[campo2].value;
			if (pass1 === pass2) {
				return null;
			}
			return {
				sonIguales: true
			};
		};
	}

	ngOnInit() {
		this.forma = new FormGroup({
			email: new FormControl(null, [Validators.required, Validators.email]),
			nombre: new FormControl(null, Validators.required),
			empresa: new FormControl(null, Validators.required),
			password: new FormControl(null, Validators.required),
			password2: new FormControl(null, Validators.required),
			condiciones: new FormControl(false)
		}, { validators: this.sonIguales('password', 'password2') });
	}

	registrarUsuario() {

		if (this.forma.invalid) {
			Swal.fire('Faltan datos', 'Verifique el el email sea correcto y que las contraseñas coincidadn.', 'warning');
			return;
		}

		if (!this.forma.value.condiciones) {
			Swal.fire('Importante', 'Debe de aceptar las condiciones', 'warning');
			return;
		}

		const usuario = new User(
			this.forma.value.nombre,
			this.forma.value.email,
			this.forma.value.password,
			this.forma.value.empresa
		);
		
		this.userService.registerUser(usuario).subscribe((data: any) => {
			if ( data.ok ) {
				this.router.navigate(['/login'])
			}
		})
	}

}
