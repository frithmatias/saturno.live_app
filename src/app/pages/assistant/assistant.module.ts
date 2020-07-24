import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistantRoutingModule } from './assistant-routing.module';

import { AssistantComponent } from './assistant.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DesktopComponent } from './desktop/desktop.component';
import { MaterialModule } from '../../modules/material.module';


@NgModule({
  declarations: [
    AssistantComponent, 
    HomeComponent,
    DashboardComponent, 
    DesktopComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AssistantRoutingModule
  ]
})
export class AssistantModule { }
