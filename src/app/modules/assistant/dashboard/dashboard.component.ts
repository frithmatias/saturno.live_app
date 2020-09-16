import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MetricService } from '../../../services/metric.service';
import { MetricResponse, Metrics } from '../../../interfaces/metric.interface';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = false;
  metrics: Metrics = { total: 0, avg: 0, tickets: [] }
  date: Date = new Date();

  constructor(
    private metricService: MetricService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    let hoy = new Date().setHours(0,0,0,0);
    this.getMetrics(hoy);
  }

  setDate(e: MatDatepickerInputEvent<Date>): void {
    let fcSel = + new Date(e.value);
    this.date = new Date(fcSel);
    this.getMetrics(fcSel);
  }

  getMetrics(fcSel: number) {
    this.loading = true;
    let idUser = this.loginService.user._id;
    this.metricService.getUserMetrics(fcSel, idUser).subscribe((data: MetricResponse) => {
      this.metrics = data.metrics;
      this.loading = false;
    }, () => { this.loading = false; })
  }
}
