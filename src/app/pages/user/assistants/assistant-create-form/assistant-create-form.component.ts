import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { User, UserResponse } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { AjaxError } from 'rxjs/ajax';
import { HttpErrorResponse } from '@angular/common/http';
import { Skill, SkillsResponse } from '../../../../interfaces/skill.interface';
import { AssistantResponse } from '../../../../interfaces/assistant.interface';

@Component({
	selector: 'app-assistant-create-form',
	templateUrl: './assistant-create-form.component.html',
	styleUrls: ['./assistant-create-form.component.css']
})
export class AssistantCreateFormComponent implements OnInit, OnChanges{
	@Input() assistantEdit: User;
	@Output() updateAssistants: EventEmitter<string> = new EventEmitter();
	selStrSkills: string[] = [];
	forma: FormGroup;
	skills: Skill[] = [];

	constructor(
		private userService: UserService,
		private snack: MatSnackBar
	) { }

	ngOnInit(): void {
		// build reactive form

		this.forma = new FormGroup({
			rol: new FormControl(null, Validators.required),
			nombre: new FormControl(null, Validators.required),
			email: new FormControl(null, [Validators.required, Validators.email]),
			password: new FormControl(null, Validators.required),
			password2: new FormControl(null, Validators.required),
			condiciones: new FormControl(false)
		}, { validators: this.sonIguales('password', 'password2') });


		this.userService.readSkills(this.userService.usuario.id_company).subscribe((data: SkillsResponse) => {
			this.skills = data.skills;
		})



	}


	ngOnChanges(changes: SimpleChanges): void {

		// this.forma.controls.password.disable();
		// this.forma.controls.password2.disable();
		
		this.forma?.patchValue({
			rol: changes.assistantEdit.currentValue.id_role,
			email: changes.assistantEdit.currentValue.tx_email,
			nombre: changes.assistantEdit.currentValue.tx_name,
			password: '******',
			password2: '******'

		})

		this.selStrSkills = changes.assistantEdit?.currentValue?.id_skills;


	}

	// validators
	sonIguales(campo1: string, campo2: string) {
		return (group: FormGroup) => {
			const pass1 = group.controls[campo1].value;
			const pass2 = group.controls[campo2].value;
			if (pass1 === pass2) {
				return null;
			}
			return {
				password: 'Las contraseñas deben ser iguales'
			};
		};
	}

	setNewSkill(skill: any): void {

	}




	createAssistant(formDirective: FormGroupDirective) {

		if (!this.selStrSkills || this.selStrSkills.length === 0) {
			this.snack.open('Seleccione al menos un skill', 'ACEPTAR', {duration: 5000});
			return;
		}

		if (this.forma.invalid) {
			if(this.forma.errors?.password){
				this.snack.open(this.forma.errors.password, 'ACEPTAR', {duration: 5000});
			}
			return;
		}

		if(this.assistantEdit){
			const assistant: User = {
				_id: this.assistantEdit._id,
				id_role: this.forma.value.rol,
				tx_name: this.forma.value.nombre,
				tx_email: this.forma.value.email,
				tx_password: this.forma.value.password,
				id_skills: this.selStrSkills
			};
	
			this.userService.updateAssistant(assistant).subscribe((data: AssistantResponse) => {
				this.assistantEdit = null;
				this.updateAssistants.emit(data.assistant._id);
				this.snack.open(data.msg, null, { duration: 5000 });
				this.forma.reset();
				formDirective.resetForm();
			},
				(err: HttpErrorResponse) => {
					this.snack.open(err.error.msg, null, { duration: 5000 });
				}
			)

		} else {

			const assistant: User = {
				tx_name: this.forma.value.nombre,
				tx_email: this.forma.value.email,
				tx_password: this.forma.value.password,
				id_company: this.userService.usuario.id_company,
				id_skills: this.selStrSkills
			};
			
			this.userService.createAssistant(assistant).subscribe(
				(data: AssistantResponse) => {
				this.updateAssistants.emit(data.assistant._id);
				this.snack.open(data.msg, null, { duration: 5000 });
				this.forma.reset();
				formDirective.resetForm();
				},
				(err: HttpErrorResponse) => {
					this.snack.open(err.error.msg, null, { duration: 5000 });
				}
			)
		}

	}

	manejaError = (err: AjaxError) => {
		return of<AjaxError>(err);  
	}
}
