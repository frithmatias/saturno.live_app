import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// PAGES
import { HomeComponent } from './home/home.component';
import { EscritorioComponent } from './escritorio/escritorio.component';
import { AsistenteComponent } from './asistente.component';

// MODULES
import { AsistenteRoutingModule } from './asistente-routing.module';
import { MaterialModule } from '../../modules/material.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
	declarations: [
		EscritorioComponent,
		HomeComponent,
		AsistenteComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MaterialModule,
		ComponentsModule,
		AsistenteRoutingModule
	]
})
export class AsistenteModule { }

