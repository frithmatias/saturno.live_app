import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { User } from '../../interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Company } from '../../interfaces/company.interface';
import { GetidstringPipe } from '../../pipes/getidstring.pipe';

@Component({
	selector: 'app-registro',
	templateUrl: './registro.component.html',
	styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
	forma: FormGroup;
	publicName: string;
	constructor(
		private userService: UserService,
		private router: Router,
		private snack: MatSnackBar,
		private getidstring: GetidstringPipe,
	) { }



	ngOnInit() {
		// this.publicUrl = document.
		// this.publicUrl = location.origin + '/#/publico/';
		let defaults = {
			company: 'WebTurnos',
			addressStreet: 'Mercedes',
			companyString: '',
			addressNumber: '2325',
			city: 'CABA',
			name: 'Matias',
			email: 'matias@matias.com',
			password1: '123456',
			password2: '123456'
		}
		this.forma = new FormGroup({
			company: new FormControl(defaults.company, [Validators.required, this.validatorSetId.bind(this)]),
			companyString: new FormControl({value:'', disabled: true}),
			addressStreet: new FormControl(defaults.addressStreet, Validators.required),
			addressNumber: new FormControl(defaults.addressNumber, Validators.required),
			city: new FormControl(defaults.city, Validators.required),
			name: new FormControl(defaults.name, Validators.required),
			email: new FormControl(defaults.email, [Validators.required, Validators.email]),
			password1: new FormControl(defaults.password1, Validators.required),
			password2: new FormControl(defaults.password2, Validators.required),
			condiciones: new FormControl(false)
		}, { validators: this.sonIguales('password1', 'password2') });


		
	}

	validatorSetId(control: FormControl): any {
		// utilizo el pipe getidstring que limpia de acentos, ñ, espacios y me devuelve un tolower.
		console.log(control);
		this.publicName = this.getidstring.transform(control.value);
		this.forma?.patchValue({ companyString: this.publicName });
		return null;
	}

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

	registrarUsuario() {

		if (this.forma.invalid) {
			Swal.fire('Faltan datos', 'Verifique el el email sea correcto y que las contraseñas coincidadn.', 'warning');
			return;
		}

		if (!this.forma.value.condiciones) {
			Swal.fire('Importante', 'Debe de aceptar las condiciones', 'warning');
			return;
		}

		const company: Company = {
			tx_company_name: this.forma.value.company,
			tx_public_name: this.publicName,
			tx_address_street: this.forma.value.addressStreet,
			tx_address_number: this.forma.value.addressNumber,
			cd_city: this.forma.value.city
		}

		const user: User = {
			tx_name: this.forma.value.name,
			tx_email: this.forma.value.email,
			tx_password: this.forma.value.password1,
			id_company: this.forma.value.company
		};

		this.userService.registerUser(company, user).subscribe((data: any) => {
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
