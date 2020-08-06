import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Skill, SkillsResponse, SkillResponse } from '../../../interfaces/skill.interface';
import { MatStepper } from '@angular/material/stepper';
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  skills: Skill[];
  user: User;
  constructor(
    private userService: UserService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {

    if (this.userService.usuario) {

      this.user = this.userService.usuario;

      if (this.user.id_company) {
        let idCompany = this.user.id_company._id;
        this.readSkills(idCompany);
      }

      this.userService.user$.subscribe(data => {
        if (data) {
          this.user = data;
          if (data.id_company) { this.readSkills(data.id_company._id); }
        }
      });

    }
  }

  editSkill(idSkill: string): void {

  }

  deleteSkill(idSkill: string): void {

    this.snack.open('Desea eliminar el skill?', 'ELIMINAR', { duration: 10000 }).afterDismissed().subscribe((data: MatSnackBarDismiss) => {
      if (data.dismissedByAction) {

        this.userService.deleteSkill(idSkill).subscribe((data: SkillResponse) => {
          this.snack.open(data.msg, null, { duration: 5000 });
          this.skills = this.skills.filter(skill => skill._id != idSkill);
        },
          (err: SkillResponse) => {
            this.snack.open(err.msg, null, { duration: 5000 });
          }
        )

      }
    });

  }

  skillCreated(skill: Skill): void {
    this.skills.push(skill);
  }

  readSkills(idCompany: string) {
    this.userService.readSkills(idCompany).subscribe((data: SkillsResponse) => {
      this.skills = data.skills;
    });
  }
}
