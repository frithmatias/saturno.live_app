import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENTS
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';

import { AdminComponent } from './pages/admin/admin.component';
import { UserComponent } from './pages/user/user.component';
import { AsistenteComponent } from './pages/asistente/asistente.component';
import { PublicoComponent } from './pages/publico/publico.component';

// GUARDS
import { LoginGuard } from './guards/login.guard';
import { TokenGuard } from './guards/token.guard';
import { AdminGuard } from './guards/admin.guard';

const appRoutes: Routes = [

	{ path: 'home', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'registro', component: RegistroComponent },
	
	{ 	path: 'publico', 															
		component: PublicoComponent, 	
		loadChildren: () => import('./pages/publico/publico.module').then((m) => m.PublicoModule)},

	{ 	path: 'asistente', 	
		canActivate: [LoginGuard, TokenGuard],				
		component: AsistenteComponent, 	
		loadChildren: () => import('./pages/asistente/asistente.module').then((m) => m.AsistenteModule)}, 

	{ 	path: 'user', 		
		canActivate: [LoginGuard, TokenGuard], 				
		component: UserComponent, 		
		loadChildren: () => import('./pages/user/user.module').then((m) => m.UserModule)},
	
	{ 	path: 'admin', 		
		canActivate: [LoginGuard, TokenGuard, AdminGuard], 	
		component: AdminComponent, 		
		loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule)},

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
