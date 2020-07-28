import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
	selector: 'app-home-user',
	templateUrl: './home-user.component.html',
	styleUrls: [ './home-user.component.css' ]
})
export class HomeUserComponent implements OnInit {
	publicURL: string;
	constructor(public userService: UserService) {}
	ngOnInit() {
		console.log(this.userService.usuario.id_company._id)
		this.publicURL = `https://webturnos.herokuapp.com/${this.userService.usuario.id_company._id}`;
	}
}
