import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar, MatSnackBarRef, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { User, UsersResponse, UserResponse } from '../../../interfaces/user.interface';
import { AssistantsResponse, Assistant } from '../../../interfaces/assistant.interface';

@Component({
  selector: 'app-assistants',
  templateUrl: './assistants.component.html',
  styleUrls: ['./assistants.component.css']
})
export class AssistantsComponent implements OnInit {
  assistants: Assistant[];
  assistantEdit: User;
  assistantUpdated: string;
  constructor(
    private userService: UserService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.readAssistants();
  }


  editAssistant(assistant: User): void {
    this.assistantEdit = assistant
  }

  deleteAssistant(idAssistant: string): void {
    this.snack.open('Desea eliminar el asistente?', 'ELIMINAR', {duration: 10000}).afterDismissed().subscribe((data: MatSnackBarDismiss) => {
      if(data.dismissedByAction){
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
    this.readAssistants();
  }

  readAssistants(): void {
    let idUser = this.userService.usuario._id;
    this.userService.readAssistants(idUser).subscribe((data: AssistantsResponse) => {
      this.assistants = data.assistants;
    });
  }
}
