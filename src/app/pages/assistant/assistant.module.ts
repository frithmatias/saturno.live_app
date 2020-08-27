import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistantRoutingModule } from './assistant-routing.module';

import { FormsModule } from '@angular/forms';
import { AssistantComponent } from './assistant.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DesktopComponent } from './desktop/desktop.component';
import { MaterialModule } from '../../modules/material.module';
import { TimeToHmsPipe } from 'src/app/pipes/time-to-hms.pipe';
import { IntervalToHmsPipe } from 'src/app/pipes/interval-to-hms.pipe';


@NgModule({
  declarations: [
    AssistantComponent, 
    HomeComponent,
    DashboardComponent, 
    DesktopComponent,
    TimeToHmsPipe,
    IntervalToHmsPipe
  ],
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    AssistantRoutingModule
  ],
  exports:[
    TimeToHmsPipe,
    IntervalToHmsPipe
  ]
})
export class AssistantModule { }
