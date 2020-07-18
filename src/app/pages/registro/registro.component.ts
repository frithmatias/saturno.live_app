import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { User } from '../../interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-registro',
	templateUrl: './registro.component.html',
	styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
	forma: FormGroup;

	constructor(
		private userService: UserService,
		private router: Router,
		private snack: MatSnackBar
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

		let defaults = {
			name: 'Matias',
			email: 'matias@matias.com',
			company: 'webturnos',
			password1: '123456',
			password2: '123456'
		}
		this.forma = new FormGroup({
			name: new FormControl(defaults.name, Validators.required),
			email: new FormControl(defaults.email, [Validators.required, Validators.email]),
			company: new FormControl(defaults.company, Validators.required),
			password1: new FormControl(defaults.password1, Validators.required),
			password2: new FormControl(defaults.password2, Validators.required),
			condiciones: new FormControl(false)
		}, { validators: this.sonIguales('password1', 'password2') });


		
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

		const usuario: User = {
			tx_name: this.forma.value.name,
			tx_email: this.forma.value.email,
			tx_password: this.forma.value.password1,
			id_company: this.forma.value.company
		};

		this.userService.registerUser(usuario).subscribe((data: any) => {
			if (data.ok) {
				this.router.navigate(['/login'])
			}
		},
		()=>{
			this.snack.open('Error al registrar el usuario', 'Aceptar', {duration:5000});
		}
		)
	}

}
