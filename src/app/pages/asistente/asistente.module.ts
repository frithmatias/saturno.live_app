import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsistenteRoutingModule } from './asistente-routing.module';

import { AsistenteComponent } from './asistente.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DesktopComponent } from './desktop/desktop.component';
import { MaterialModule } from 'src/app/modules/material.module';


@NgModule({
  declarations: [
    AsistenteComponent, 
    HomeComponent,
    DashboardComponent, 
    DesktopComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AsistenteRoutingModule
  ]
})
export class AsistenteModule { }
