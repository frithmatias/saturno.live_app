import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// PAGES
import { HomeClienteComponent } from './home-cliente/home-cliente.component';
import { EscritorioComponent } from './escritorio/escritorio.component';
import { ClienteComponent } from './cliente.component';

// MODULES
import { ClienteRoutingModule } from './cliente-routing.module';
import { MaterialModule } from '../../modules/material.module';
import { ComponentsModule } from '../../components/components.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
	declarations: [
		EscritorioComponent,
		HomeClienteComponent,
		ClienteComponent,
		DashboardComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MaterialModule,
		ComponentsModule,
		ClienteRoutingModule
	]
})
export class ClienteModule { }

