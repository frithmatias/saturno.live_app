import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// PAGES
import { AdminComponent } from './admin.component';

import { CompaniesComponent } from './companies/companies.component';
import { CompanyCreateComponent } from './companies/company-create/company-create.component';
import { SkillsComponent } from './skills/skills.component';
import { SkillCreateFormComponent } from './skills/skill-create-form/skill-create-form.component';
import { DesktopsComponent } from './desktops/desktops.component';
import { DesktopCreateFormComponent } from './desktops/desktop-create-form/desktop-create-form.component';
import { AssistantsComponent } from './assistants/assistants.component';
import { AssistantCreateFormComponent } from './assistants/assistant-create-form/assistant-create-form.component';

import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { TicketsComponent } from './tickets/tickets.component';

// MODULES
import { AdminRoutingModule } from './admin-routing.module';
import { MaterialModule } from '../../modules/material.module';
import { ComponentsModule } from '../../components/components.module';
import { WordMaxLengthPipe } from '../../pipes/word-max-length.pipe';

@NgModule({
	declarations: [
		HomeComponent,
		AdminComponent,
		DashboardComponent,
		ProfileComponent,
		AssistantsComponent,
		DesktopsComponent,
		TicketsComponent,
		AssistantCreateFormComponent,
		DesktopCreateFormComponent,
		SkillsComponent,
		SkillCreateFormComponent,
		CompaniesComponent,
		CompanyCreateComponent,
		WordMaxLengthPipe,

	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MaterialModule,
		ComponentsModule,
		AdminRoutingModule,
	]
})
export class AdminModule { }

