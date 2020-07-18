import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { AssistantsResponse, Assistant, AssistantResponse } from '../../../interfaces/assistant.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assistants',
  templateUrl: './assistants.component.html',
  styleUrls: ['./assistants.component.css']
})
export class AssistantsComponent implements OnInit {
  assistants: Assistant[];
  constructor(
    private userService: UserService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userService.readAssistants(this.userService.usuario._id).subscribe((data: AssistantsResponse) => {
      this.assistants = data.assistants;
    },
      (err) => {
        console.log(err);
      })
  }


  editAssistant(idAssistant: string): void {

  }
  deleteAssistant(idAssistant: string): void {
    this.userService.deleteAssistant(idAssistant).subscribe((data: AssistantResponse) => {
      this.snack.open(data.msg, null, { duration: 5000 });
      this.assistants = this.assistants.filter(assistant => assistant._id != idAssistant);
    },
      (err: AssistantResponse) => {
        this.snack.open(err.msg, null, { duration: 5000 });
      }
    )

  }

  assistantCreated(assistant: Assistant): void {
    this.assistants.push(assistant);
  }
}
