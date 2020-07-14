import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EscritorioComponent } from './escritorio/escritorio.component';
import { HomeClienteComponent } from './home-cliente/home-cliente.component';
import { ClienteComponent } from './cliente.component';
import { NopagefoundComponent } from '../nopagefound/nopagefound.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const assistantRoutes: Routes = [
  { path: 'escritorio/:id', component: EscritorioComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'home', component: HomeClienteComponent },
	{ path: '', redirectTo: '/cliente/home', pathMatch: 'full' },
  { path: '**', component: NopagefoundComponent}

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(assistantRoutes)], 
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
