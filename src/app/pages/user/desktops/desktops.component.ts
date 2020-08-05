import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Desktop, DesktopsResponse, DesktopResponse } from '../../../interfaces/desktop.interface';

@Component({
  selector: 'app-desktops',
  templateUrl: './desktops.component.html',
  styleUrls: ['./desktops.component.css']
})
export class DesktopsComponent implements OnInit {
  desktops: Desktop[];
  constructor(
    private userService: UserService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.readDesktops();
  }

  editDesktop(idDesktop: string): void {

  }

  deleteDesktop(idDesktop: string): void {
    this.snack.open('Desea eliminar el escritorio?', 'ELIMINAR', { duration: 10000 }).afterDismissed().subscribe((data: MatSnackBarDismiss) => {
      if (data.dismissedByAction) {
        this.userService.deleteDesktop(idDesktop).subscribe((data: DesktopResponse) => {
          this.snack.open(data.msg, null, { duration: 5000 });
          this.desktops = this.desktops.filter(desktop => desktop._id != idDesktop);
        },
          (err: DesktopResponse) => {
            this.snack.open(err.msg, null, { duration: 5000 });
          }
        )
      }
    });
  }

  desktopCreated(desktop: Desktop): void {
    this.desktops.push(desktop);
  }

  readDesktops(){
    let idUser = this.userService.usuario._id;
    this.userService.readDesktops(idUser).subscribe((data: DesktopsResponse) => {
      this.desktops = data.desktops;
    });
  }
}
