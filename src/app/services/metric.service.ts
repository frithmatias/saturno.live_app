import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class MetricService {

  constructor(
    private http: HttpClient,
    private loginService: LoginService) { }

	getUserMetrics(fcSel: number, idUser: string): Observable<object> {
		const headers = new HttpHeaders({
			'turnos-token': this.loginService.token
		});

		let data = { fcSel, idUser };
		const url = environment.url + `/m/getusermetrics`;
		return this.http.post(url, data, { headers });
	}

}
