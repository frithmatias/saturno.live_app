import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Skill, SkillResponse } from '../../../../interfaces/skill.interface';

@Component({
  selector: 'app-skill-create-form',
  templateUrl: './skill-create-form.component.html',
  styleUrls: ['./skill-create-form.component.css']
})
export class SkillCreateFormComponent implements OnInit {
  @Output() skillCreated: EventEmitter<Skill> = new EventEmitter();
  forma: FormGroup;
  constructor(
		private userService: UserService,
		private snack: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.forma = new FormGroup({
      idSkill: new FormControl(null, Validators.required),
			txSkill: new FormControl(null, Validators.required)
		});
  }

	createSkill(formDirective: FormGroupDirective) {
		
		

		if (this.forma.invalid) {
			return;
		}

		const skill: Skill = {
			id_company: this.userService.usuario.id_company,
			id_skill: this.forma.value.idSkill,
			tx_skill: this.forma.value.txSkill,
			__v: null,
			_id: null
		};

		this.userService.createSkill(skill).subscribe((data: SkillResponse) => {
			console.log(data);
			this.skillCreated.emit(data.skill);
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
