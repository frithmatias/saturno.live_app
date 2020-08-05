import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Desktop, DesktopResponse } from '../../../../interfaces/desktop.interface';
import { Company, CompaniesResponse } from '../../../../interfaces/company.interface';

@Component({
	selector: 'app-desktop-create-form',
	templateUrl: './desktop-create-form.component.html',
	styleUrls: ['./desktop-create-form.component.css']
})
export class DesktopCreateFormComponent implements OnInit {
	@Output() desktopCreated: EventEmitter<Desktop> = new EventEmitter();
	forma: FormGroup;

	constructor(
		public userService: UserService,
		private snack: MatSnackBar
	) { }

	ngOnInit(): void {

		this.forma = new FormGroup({
			idCompany: new FormControl(null, Validators.required),
			cdDesktop: new FormControl(null, Validators.required),
			idType: new FormControl(null)
		});
	}

	createDesktop(formDirective: FormGroupDirective) {

		if (this.forma.invalid) {
			return;
		}

		const desktop: Desktop = {
			id_company: this.forma.value.idCompany,
			cd_desktop: this.forma.value.cdDesktop,
			id_assistant: null,
			__v: null,
			_id: null
		};

		this.userService.createDesktop(desktop).subscribe((data: DesktopResponse) => {
			this.desktopCreated.emit(data.desktop);
			this.snack.open(data.msg, null, { duration: 5000 });
			this.forma.reset();
			formDirective.resetForm();
		},
			(err: any) => {
				this.snack.open(err.error.msg, null, { duration: 5000 });
			}
		)
	}

}
