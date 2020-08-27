import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENTS
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { ContactComponent } from './pages/contact/contact.component';

import { SuperuserComponent } from './pages/superuser/superuser.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AssistantComponent } from './pages/assistant/assistant.component';
import { PublicComponent } from './pages/public/public.component';

// GUARDS
import { LoginGuard } from './guards/login.guard';
import { TokenGuard } from './guards/token.guard';
import { AdminGuard } from './guards/admin.guard';
import { SuperuserModule } from './pages/superuser/superuser.module';

const appRoutes: Routes = [

	{ path: 'home', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'contact', component: ContactComponent },
	
	{ 	path: 'public', 															
		component: PublicComponent, 	
		loadChildren: () => import('./pages/public/public.module').then((m) => m.PublicModule)},

	{ 	path: 'assistant', 	
		canActivate: [LoginGuard, TokenGuard],				
		component: AssistantComponent, 	
		loadChildren: () => import('./pages/assistant/assistant.module').then((m) => m.AssistantModule)}, 

	{ 	path: 'admin', 		
		canActivate: [LoginGuard, TokenGuard], 				
		component: AdminComponent, 		
		loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule)},
	
	{ 	path: 'superuser', 		
		canActivate: [LoginGuard, TokenGuard, AdminGuard], 	
		component: SuperuserComponent, 		
		loadChildren: () => import('./pages/superuser/superuser.module').then((m) => m.SuperuserModule)},

	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: '**',     component: NopagefoundComponent }
];

@NgModule({
	declarations: [],
	imports: [ RouterModule.forRoot(appRoutes, { useHash: true })],
	exports: [
		RouterModule 
	]
})
export class AppRoutingModule {}
