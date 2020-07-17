import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsistenteRoutingModule } from './asistente-routing.module';

import { AsistenteComponent } from './asistente.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DesktopComponent } from './desktop/desktop.component';


@NgModule({
  declarations: [
    AsistenteComponent, 
    HomeComponent,
    DashboardComponent, 
    DesktopComponent
  ],
  imports: [
    CommonModule,
    AsistenteRoutingModule
  ]
})
export class AsistenteModule { }
