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
  activateSkills = false;
  activateSlide = true;

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
      if (data.skills.length === 0) {
        this.createGenericSkill().catch(() => {
          this.userService.snackShow('Error al crear el skill por defecto!', 5000);
        })
      }
    });
  }

  toggleSkills() {
    if (this.activateSlide) {
      if (this.activateSkills) { // el usuario desactiva los skills
        if (this.skills.length > 0) { // verifico que tenga skills

          let hasUserSkill = false;
          for (let skill of this.skills) {
            if (skill.bl_generic === false) {
              hasUserSkill = true;
              break;
            }
          }

          if (hasUserSkill) {
            this.activateSlide = false;
            this.userService.snackAsk('Hay habilidades creadas, desea eliminarlas?', 'Aceptar', 5000).then(() => {
              this.deleteAllSkills().then(() => {
               return this.createGenericSkill().then(() => { // borro skills y creo generico correctamente
                 this.activateSkills = false;
                 this.activateSlide = true;
                  this.userService.snackShow('Habilidades Desactivadas!', 2000);
                });
              }).catch(() => {  // fallo borrar los skills o crear el generico
                this.activateSkills = true;
                this.activateSlide = true;
                this.userService.snackShow('Error al eliminar las habilidades!', 5000);
              })
            }).catch(() => { // el usuario no respondio
              this.activateSkills = true;
              this.activateSlide = true;
              return;
            })
          } else { // already has generic skill do nothing

          }
        } else {
          this.createGenericSkill();
        }
      } else {
        // elimino los skills, al activar sólo puede haber un skill genérico
        this.deleteAllSkills();
      }
    }
  }

  deleteAllSkills(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.skills.length > 0) {
        for (let skill of this.skills) {
          let idSkill = skill._id;
          this.userService.deleteSkill(idSkill).subscribe((data: SkillResponse) => {
            if(data.ok){
              this.skills = this.skills.filter(skill => skill._id !== data.skill._id);
              this.userService.skills = this.skills;
            }
          });
        }
      }
      resolve();
    });
  }

  createGenericSkill(): Promise<Skill | null> {
    return new Promise((resolve, reject) => {

      const skill: Skill = {
        id_company: this.userService.user.id_company._id,
        cd_skill: 'T',
        tx_skill: 'DEFAULT_SKILL',
        bl_generic: true,
        _id: null
      };

      this.userService.createSkill(skill).subscribe((data: SkillResponse) => {

        if (data.ok) {
          this.skills.push(data.skill);
          this.userService.skills = this.skills;
          resolve(data.skill)
        }
      },
        (err: any) => {
          this.snack.open(err.error.msg, null, { duration: 5000 });
          reject(null);
        }
      )
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
