import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MetricService {

  constructor(
    private http: HttpClient,
    private userService: UserService) { }

	getUserMetrics(fcSel: number, idUser: string): Observable<object> {

		const headers = new HttpHeaders({
			'turnos-token': this.userService.token
		});

		let data = { fcSel, idUser };
		const url = environment.url + `/m/getusermetrics`;
		return this.http.post(url, data, { headers });
	}

}
