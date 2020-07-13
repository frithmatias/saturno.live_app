import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EscritorioComponent } from './escritorio/escritorio.component';
import { HomeClienteComponent } from './home-cliente/home-cliente.component';
import { ClienteComponent } from './cliente.component';

const assistantRoutes: Routes = [
	{ path: 'escritorio/:id', component: EscritorioComponent },
  { path: 'home', component: HomeClienteComponent },
  { path: '**', component: ClienteComponent},
	{ path: '', redirectTo: '/home', pathMatch: 'full' }

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(assistantRoutes)], 
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
