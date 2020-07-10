import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EscritorioComponent } from './escritorio/escritorio.component';
import { HomeComponent } from './home/home.component';

const assistantRoutes: Routes = [
	{ path: 'escritorio/:id', component: EscritorioComponent },
	{ path: 'home', component: HomeComponent },
	{ path: '', redirectTo: '/home', pathMatch: 'full' }

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(assistantRoutes)], 
  exports: [RouterModule]
})
export class AsistenteRoutingModule { }
