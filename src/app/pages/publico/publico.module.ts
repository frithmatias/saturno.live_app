import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// PAGES
import { PantallaComponent } from './pantalla/pantalla.component';
import { TurnosComponent } from './turnos/turnos.component';
import { PublicoComponent } from './publico.component';

// MODULES
import { PublicoRoutingModule } from './publico-routing.module';
import { MaterialModule } from '../../modules/material.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
	declarations: [
		PantallaComponent,
		TurnosComponent,
		PublicoComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MaterialModule,
		ComponentsModule,
		PublicoRoutingModule
	]
})
export class PublicoModule { }

