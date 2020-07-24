import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// PAGES
import { ScreenComponent } from './screen/screen.component';
import { TicketsComponent } from './tickets/tickets.component';
import { PublicComponent } from './public.component';

// MODULES
import { PublicRoutingModule } from './public-routing.module';
import { MaterialModule } from '../../modules/material.module';
import { ComponentsModule } from '../../components/components.module';
import { SearchComponent } from './search/search.component';


@NgModule({
	declarations: [
		ScreenComponent,
		TicketsComponent,
		PublicComponent,
		SearchComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MaterialModule,
		ComponentsModule,
		PublicRoutingModule
	]
})
export class PublicModule { }

