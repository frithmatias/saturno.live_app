import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Skill, SkillsResponse, SkillResponse } from '../../../interfaces/skill.interface';
import { MatStepper } from '@angular/material/stepper';
import { User } from 'src/app/interfaces/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, OnDestroy {

  skills: Skill[];
  user: User;
  userSubscription: Subscription;
  activateSkills = true;

  constructor(
    private userService: UserService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {

    if (this.userService.user) {

      this.user = this.userService.user;

      if (this.user.id_company) {
        let idCompany = this.user.id_company._id;
        this.readSkills(idCompany);
      }

      this.userSubscription = this.userService.user$.subscribe(data => {
        if (data) {
          this.user = data;
          if (data.id_company) { this.readSkills(data.id_company._id); }
        }
      });

    }
  }

  deleteSkill(idSkill: string): void {

    this.snack.open('Desea eliminar el skill?', 'ELIMINAR', { duration: 10000 }).afterDismissed().subscribe((data: MatSnackBarDismiss) => {
      if (data.dismissedByAction) {

        this.userService.deleteSkill(idSkill).subscribe((data: SkillResponse) => {
          this.snack.open(data.msg, null, { duration: 5000 });
          this.skills = this.skills.filter(skill => skill._id != idSkill);
          this.userService.skills = this.skills;
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
      this.userService.skills = data.skills;
    });
  }

  toggleSkills() {

    if (this.activateSkills) { // el usuario desactiva los skills

      if (this.skills.length > 0) { // verifico que tenga skills

        let hasNoGenericSkill = false;
        for (let skill of this.skills) {
          if (skill.bl_generic === false) {
            hasNoGenericSkill = true;
            break;
          }
        }

        if (hasNoGenericSkill) {
          
          this.userService.snackAsk('Se eliminarán los skills creados', 'Aceptar', 5000).then(() => {
            this.deleteAllSkills();
            this.createGenericSkill().then(() => {
              this.userService.snackShow('Se creó un skill genérico y único.', 2000);
            });
          }).catch(() => {
            this.activateSkills = true;
            return;
          })

        } 
      } else {
        this.createGenericSkill();
      }

    } else {

      // elimino los skills, al activar sólo puede haber un skill genérico
      this.deleteAllSkills();

    }
  }

  deleteAllSkills(): void {
    if (this.skills.length > 0) {
      for (let skill of this.skills) {
        let idSkill = skill._id;
        this.userService.deleteSkill(idSkill).subscribe((data: SkillResponse) => {
          this.skills = this.skills.filter(skill => skill._id !== data.skill._id);
          this.userService.skills = this.skills;
        });
      }
    }
  }

  createGenericSkill(): Promise<boolean> {
    return new Promise((resolve, reject) => {

      const skill: Skill = {
        id_company: this.userService.user.id_company._id,
        cd_skill: 'T',
        tx_skill: 'OBTENER TURNO',
        bl_generic: true,
        __v: null,
        _id: null
      };

      this.userService.createSkill(skill).subscribe((data: SkillResponse) => {
        if (data.ok) {
          this.skills.push(data.skill);
          this.userService.skills = this.skills;
          // this.snack.open(data.msg, null, { duration: 5000 });
          resolve(true)
        }
      },
        (err: any) => {
          this.snack.open(err.error.msg, null, { duration: 5000 });
          reject(false);
        }
      )
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
