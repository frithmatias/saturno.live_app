import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/services/admin.service';
import { Skill, SkillsResponse, SkillResponse } from '../../../interfaces/skill.interface';
import { User } from 'src/app/interfaces/user.interface';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

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
    private adminService: AdminService,
    private loginService: LoginService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {

    if (this.loginService.user) {
      this.user = this.loginService.user;

      if (this.user.id_company) {
        let idCompany = this.user.id_company._id;
        this.readSkills(idCompany);
      }

      this.userSubscription = this.loginService.user$.subscribe(data => {
        if (data) {
          this.user = data;
          if (data.id_company) { this.readSkills(data.id_company._id); }
        }
      });

    }
  }

  skillCreated(skill: Skill): void {
    this.skills = this.skills.filter(skill => skill.bl_generic === false) // clear generics
    this.skills.push(skill);

    let user: User;
    user = JSON.parse(localStorage.getItem('user'));
    user.id_skills = this.skills;
    this.loginService.pushUser(user);
  }

  deleteSkill(idSkill: string): void {
    this.snack.open('Desea eliminar el skill?', 'ELIMINAR', { duration: 10000 }).afterDismissed().subscribe((data: MatSnackBarDismiss) => {
      if (data.dismissedByAction) {
        this.adminService.deleteSkill(idSkill).subscribe((data: SkillResponse) => {
          if(data.ok){
            this.snack.open(data.msg, null, { duration: 2000 });
            // update user
            let user: User;
            user = JSON.parse(localStorage.getItem('user'));
            user.id_skills = user.id_skills.filter(skill => skill._id !== data.skill._id);
            this.loginService.pushUser(user);

            // update skills
            this.skills = this.skills.filter(skill => skill._id != idSkill);
            this.adminService.skills = this.skills;

            // if last custom was removed then get generic skill
            if(this.skills.length===0){ 
              this.readSkills(data.skill.id_company).then((skills: Skill[]) => {
                let user: User;
                user = JSON.parse(localStorage.getItem('user'));
                user.id_skills = skills;
                this.loginService.pushUser(user);
              })
            }
          }
        },
          (err: SkillResponse) => {
            this.snack.open(err.msg, null, { duration: 2000 });
          }
        )
      }
    });
  }

  readSkills(idCompany: string): Promise<Skill[]> {
    return new Promise(resolve => {
      this.adminService.readSkills(idCompany).subscribe((data: SkillsResponse) => {
        if(data.ok){
          this.skills = data.skills.filter(skill => skill.bl_generic === false); // filter default_skill
          this.adminService.skills = data.skills;
          resolve(data.skills);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
