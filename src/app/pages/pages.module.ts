import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../modules/material.module';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
		RouterModule,
    CommonModule,
    ComponentsModule,
    MaterialModule
  ]
})
export class PagesModule { }
