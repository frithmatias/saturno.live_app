import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Menu, MenuResponse, Submenu } from '../../superuser.interface';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { SharedService } from '../../../../services/shared.service';
import { LoginService } from '../../../../services/login.service';
import { SuperuserService } from '../../superuser.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AjaxError } from 'rxjs/ajax';
import { of } from 'rxjs';

@Component({
  selector: 'app-menu-create-form',
  templateUrl: './menu-create-form.component.html',
  styleUrls: ['./menu-create-form.component.css']
})
export class MenuCreateFormComponent implements OnInit {
  
  @Input() menuEdit: Menu;
  @Output() idMenuUpdated: EventEmitter<string> = new EventEmitter();

  forma: FormGroup;
  menus: Menu[] = [];
  constructor(
		private loginService: LoginService,
    private sharedService: SharedService,
    private superuserService: SuperuserService
  ) { }

  ngOnInit(): void {
    this.forma = new FormGroup({
      cd_role: new FormControl(null, Validators.required),
      tx_titulo: new FormControl(null, Validators.required),
      tx_icon: new FormControl(null, Validators.required)
    });
  }

	ngOnChanges(changes: SimpleChanges) {
		this.forma?.patchValue({
			cd_role: changes.menuEdit.currentValue.cd_role,
			tx_titulo: changes.menuEdit.currentValue.tx_titulo,
			tx_icon: changes.menuEdit.currentValue.tx_icon
    })
  }

  createMenu(formDirective: FormGroupDirective) {

    if (this.forma.invalid) {
      this.sharedService.snackShow('Formulario invalido', 2000);
      return;
    }

    const menu: Menu = {
      cd_role: this.forma.value.cd_role,
      tx_titulo: this.forma.value.tx_titulo,
      tx_icon: this.forma.value.tx_icon,
      _id: null
    }



    if (this.menuEdit) {
      menu._id = this.menuEdit._id;

      this.superuserService.updateMenu(menu).subscribe((data: MenuResponse) => {
        if (data.ok) {
          this.idMenuUpdated.emit(data.menu._id);
          this.sharedService.snackShow(data.msg, 5000);
          this.resetForm(formDirective);
        }
      }, (err: HttpErrorResponse) => {
        this.sharedService.snackShow(err.error.msg, 5000);
      })

    } else {

      this.superuserService.createMenu(menu).subscribe(
        (data: MenuResponse) => {
          this.idMenuUpdated.emit(data.menu._id);
          this.sharedService.snackShow(data.msg, 5000);
          this.resetForm(formDirective);
          formDirective.resetForm();
        }, (err: HttpErrorResponse) => {
          this.sharedService.snackShow(err.error.msg, 5000);
        }
      )
    }

  }

  manejaError = (err: AjaxError) => {
    return of<AjaxError>(err);
  }


  resetForm(formDirective: FormGroupDirective) {
    this.menuEdit = null;
    this.forma.enable();
    this.forma.reset();
    formDirective.resetForm();
    this.sharedService.scrollTop();
  }
}
