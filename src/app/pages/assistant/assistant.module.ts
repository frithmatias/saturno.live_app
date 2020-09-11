import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistantRoutingModule } from './assistant-routing.module';

import { FormsModule } from '@angular/forms';
import { AssistantComponent } from './assistant.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DesktopComponent } from './desktop/desktop.component';
import { MaterialModule } from '../../modules/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [
    AssistantComponent, 
    HomeComponent,
    DashboardComponent, 
    DesktopComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    PipesModule,
    AssistantRoutingModule
  ],
  exports:[]
})
export class AssistantModule { }
