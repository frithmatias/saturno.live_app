import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service';
import { environment } from 'src/environments/environment';
import { Menu } from './superuser.interface';

@Injectable({
  providedIn: 'root'
})
export class SuperuserService {

  constructor(
    private http: HttpClient,
    private loginService: LoginService) { }


    createMenu(menu: Menu) {
      const headers = new HttpHeaders({
        'turnos-token': this.loginService.token
      });
      const url = environment.url + '/su/createmenu';
      return this.http.post(url, menu, { headers });
    }

	readMenus() {
		const headers = new HttpHeaders({
			'turnos-token': this.loginService.token
		});
		const url = environment.url + '/su/readmenus/';
		return this.http.get(url, { headers });
	}
  
	updateMenu(menu: Menu) {
		const headers = new HttpHeaders({
			'turnos-token': this.loginService.token
		});
		const url = environment.url + '/su/updatemenu';
		return this.http.post(url, menu, { headers });
	}

}
