import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Skill, SkillsResponse, SkillResponse } from '../../../interfaces/sill.interface';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  skills: Skill[];
  constructor(
    private userService: UserService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userService.readSkills(this.userService.usuario._id).subscribe((data: SkillsResponse) => {
      this.skills = data.skills;
      console.log(data);
    },
      (err) => {
        console.log(err);
      })
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

}
