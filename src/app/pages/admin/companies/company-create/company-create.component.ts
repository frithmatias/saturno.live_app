import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetidstringPipe } from '../../../../pipes/getidstring.pipe';
import { Company, CompanyResponse } from '../../../../interfaces/company.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { UserResponse } from 'src/app/interfaces/user.interface';

@Component({
	selector: 'app-company-create',
	templateUrl: './company-create.component.html',
	styleUrls: ['./company-create.component.css']
})
export class CompanyCreateComponent implements OnInit {
	@Input() companyEdit: Company;
	@Output() newCompany: EventEmitter<Company> = new EventEmitter();
	forma: FormGroup;
	publicName: string;

	constructor(
		private userService: UserService,
		private snack: MatSnackBar,
		private getidstring: GetidstringPipe
	) { }

	ngOnInit() {
		// this.publicUrl = document.
		// this.publicUrl = location.origin + '/#/public/';
		let defaults = {
			company: '',
			addressStreet: '',
			companyString: '',
			addressNumber: '',
			city: ''
		}
		this.forma = new FormGroup({
			company: new FormControl(defaults.company, [Validators.required, this.validatorSetId.bind(this)]),
			companyString: new FormControl({ value: '', disabled: true }),
			city: new FormControl(defaults.city, Validators.required),
			addressStreet: new FormControl(defaults.addressStreet, Validators.required),
			addressNumber: new FormControl(defaults.addressNumber, Validators.required),
		});
	}


	ngOnChanges(changes: SimpleChanges): void {
		this.forma?.patchValue({
			company: changes.companyEdit.currentValue.tx_company_name,
			city: changes.companyEdit.currentValue.cd_city,
			addressStreet: changes.companyEdit.currentValue.tx_address_street,
			addressNumber: changes.companyEdit.currentValue.tx_address_number
		})
	}

	validatorSetId(control: FormControl): any {
		// utilizo el pipe getidstring que limpia de acentos, ñ, espacios y me devuelve un tolower.
		this.publicName = this.getidstring.transform(control.value);
		this.forma?.patchValue({ companyString: this.publicName });
		return null;
	}

	checkCompanyExists() {

		if(this.companyEdit && (this.publicName === this.companyEdit.tx_public_name)){
			// Cuando se edita el nombre de una empresa, no debe hacer la verificacion si 
			// existe esa empresa. Esto es porque me devuelve que existe si yo cambio el nombre real 
			// pero el nombre público no cambia (FereterriaNorte a Ferreteria Norte, el nombre 
			// público es el mismo)
			return;
		}
		
		let pattern = this.publicName;
		if (pattern?.length > 3) {
			this.userService.checkCompanyExists(pattern).subscribe((data: any) => {
				if (!data.ok) {
					this.forma.controls['company'].setErrors({ 'incorrect': true });
					this.forma.setErrors({ 'companyExists': true })
				}
			});
		}
	}

	createCompany(formDirective: FormGroupDirective) {

		if (this.forma.invalid) {
			this.snack.open('Faltan datos por favor verifique', 'Aceptar', { duration: 5000 });
			return;
		}

		const company: any = {
			id_user: this.userService.user._id,
			tx_company_name: this.forma.value.company,
			tx_public_name: this.publicName,
			cd_city: this.forma.value.city,
			tx_address_street: this.forma.value.addressStreet,
			tx_address_number: this.forma.value.addressNumber
		};

		
		if (this.companyEdit) {
			company._id = this.companyEdit._id;
			this.userService.updateCompany(company).subscribe((data: CompanyResponse) => {
				this.companyEdit = null;
				this.newCompany.emit(data.company);
				this.snack.open(data.msg, null, { duration: 5000 });
				this.forma.reset();
				formDirective.resetForm();
			},	(err: HttpErrorResponse) => {
					this.snack.open(err.error.msg, null, { duration: 5000 });
				}
			)

		} else {

			this.userService.createCompany(company).subscribe((data: CompanyResponse) => {
				this.newCompany.emit(data.company);
				this.forma.reset();
				formDirective.resetForm();
				if (data.ok) {
					
					this.userService.attachCompany(data.company);
					this.userService.scrollTop();
					this.snack.open('Empresa creada correctamente', null, { duration: 2000 });
				} else {
					this.snack.open(data.msg, null, { duration: 5000 });
				}
			},	() => {
					this.snack.open('Error al crear la empresa', null, { duration: 2000 });
				});
		}
	}
	
	resetForm(formDirective: FormGroupDirective) {
		this.companyEdit = null;
		this.forma.reset();
		formDirective.resetForm();
	}
}
