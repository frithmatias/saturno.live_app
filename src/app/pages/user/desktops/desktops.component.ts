import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Desktop, DesktopsResponse, DesktopResponse } from '../../../interfaces/desktop.interface';
import { User } from 'src/app/interfaces/user.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-desktops',
  templateUrl: './desktops.component.html',
  styleUrls: ['./desktops.component.css']
})
export class DesktopsComponent implements OnInit, OnDestroy {

  desktops: Desktop[];
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
        this.readDesktops(idCompany);
      }

      this.userSubscription = this.userService.user$.subscribe(data => {
        if (data) {
          this.user = data;
          if (data.id_company) { this.readDesktops(data.id_company._id); }
        }
      });

    }
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

  readDesktops(idCompany: string) {
    this.userService.readDesktops(idCompany).subscribe((data: DesktopsResponse) => {
      this.desktops = data.desktops;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
