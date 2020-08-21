import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { User, UsersResponse, UserResponse } from '../../../interfaces/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-assistants',
  templateUrl: './assistants.component.html',
  styleUrls: ['./assistants.component.css']
})
export class AssistantsComponent implements OnInit, OnDestroy {
  assistants: User[];
  assistantEdit: User;
  assistantUpdated: string;
  user: User;
  userSubscription: Subscription;

  constructor(
    private userService: UserService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.userService.user) {
      
      this.user = this.userService.user;
      
      if (this.user.id_company) {
        let idCompany = this.user.id_company._id;
        this.readAssistants(idCompany);
      }
      
      this.userSubscription = this.userService.user$.subscribe(data => {
        if (data) {
          this.user = data;
          if (data.id_company) { this.readAssistants(data.id_company._id); }
        }
      })
    }
    
  }


  editAssistant(assistant: User): void {
    this.assistantEdit = assistant
  }

  deleteAssistant(idAssistant: string): void {
    this.snack.open('Desea eliminar el asistente?', 'ELIMINAR', { duration: 10000 }).afterDismissed().subscribe((data: MatSnackBarDismiss) => {
      if (data.dismissedByAction) {
        this.userService.deleteAssistant(idAssistant).subscribe((data: UserResponse) => {
          this.snack.open(data.msg, null, { duration: 5000 });
          this.assistants = this.assistants.filter(assistant => assistant._id != idAssistant);
        },
          (err: UserResponse) => {
            this.snack.open(err.msg, null, { duration: 5000 });
          }
        )
      }
    })
  }

  updateAssistants(assistant: string): void {
    this.assistantUpdated = assistant;
    this.readAssistants(this.userService.user.id_company._id);
  }

  readAssistants(idCompany: string): void {
    this.userService.readAssistants(idCompany).subscribe((data: UsersResponse) => {
      this.assistants = data.users;
      this.userService.assistants = data.users;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
