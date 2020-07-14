import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENTS
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';

import { PublicoComponent } from './pages/publico/publico.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { AdminComponent } from './pages/admin/admin.component';

// GUARDS
import { LoginGuard } from './guards/login.guard';
import { TokenGuard } from './guards/token.guard';
import { AdminGuard } from './guards/admin.guard';

const appRoutes: Routes = [

	{ path: 'home', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'registro', component: RegistroComponent },
	
	{ path: 'publico', component: PublicoComponent, 
		loadChildren: () => import('./pages/publico/publico.module').then((m) => m.PublicoModule)},
	{ path: 'cliente', canActivate: [LoginGuard, TokenGuard], component: ClienteComponent, 
		loadChildren: () => import('./pages/cliente/cliente.module').then((m) => m.ClienteModule)},
	{ path: 'admin', canActivate: [LoginGuard, TokenGuard, AdminGuard] , component: AdminComponent, 
		loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule)},
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: '**',     component: NopagefoundComponent }
];

@NgModule({
	declarations: [],
	imports: [ RouterModule.forRoot(appRoutes, { useHash: false })],
	exports: [
		RouterModule 
	]
})
export class AppRoutingModule {}
