import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Assistant, AssistantResponse } from '../../../../interfaces/assistant.interface';

@Component({
	selector: 'app-assistant-create-form',
	templateUrl: './assistant-create-form.component.html',
	styleUrls: ['./assistant-create-form.component.css']
})
export class AssistantCreateFormComponent implements OnInit {
	@Output() assistantCreated: EventEmitter<Assistant> = new EventEmitter();
	forma: FormGroup;

	constructor(
		private userService: UserService,
		private snack: MatSnackBar
	) { }

	ngOnInit(): void {
		this.forma = new FormGroup({
			email: new FormControl(null, [Validators.required, Validators.email]),
			nombre: new FormControl(null, Validators.required),
			password: new FormControl(null, Validators.required),
			password2: new FormControl(null, Validators.required),
			condiciones: new FormControl(false)
		}, { validators: this.sonIguales('password', 'password2') });
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

	createAssistant() {
		console.log(this.forma);
		if (this.forma.invalid) {
			return;
		}

		const assistant: User = {
			tx_name: this.forma.value.nombre,
			tx_email: this.forma.value.email,
			tx_password: this.forma.value.password,
			id_company: this.userService.usuario._id
		};

		this.userService.createAssistant(assistant).subscribe((data: AssistantResponse) => {
			this.assistantCreated.emit(data.assistant);
			this.snack.open(data.msg, null, { duration: 5000 });
		},
			(err: AssistantResponse) => {
				this.snack.open(err.msg, null, { duration: 5000 });
			}
		)
	}

}
