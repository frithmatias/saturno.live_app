import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// PAGES
import { HomeUserComponent } from './home-user/home-user.component';
import { UserComponent } from './user.component';

// MODULES
import { UserRoutingModule } from './user-routing.module';
import { MaterialModule } from '../../modules/material.module';
import { ComponentsModule } from '../../components/components.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { AssistantsComponent } from './assistants/assistants.component';
import { DesktopsComponent } from './desktops/desktops.component';
import { TicketsComponent } from './tickets/tickets.component';

@NgModule({
	declarations: [
		HomeUserComponent,
		UserComponent,
		DashboardComponent,
		ProfileComponent,
		AssistantsComponent,
		DesktopsComponent,
		TicketsComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MaterialModule,
		ComponentsModule,
		UserRoutingModule
	]
})
export class UserModule { }

