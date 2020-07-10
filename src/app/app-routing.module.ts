import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENTS
import { PagesComponent } from './pages/pages.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';

import { PublicoComponent } from './pages/publico/publico.component';
import { AsistenteComponent } from './pages/asistente/asistente.component';
import { AdminComponent } from './pages/admin/admin.component';

const appRoutes: Routes = [
	{ path: 'registro', component: RegistroComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'home', component: PagesComponent },


	{ path: 'publico', component: PublicoComponent, 
		loadChildren: () => import('./pages/publico/publico.module').then((m) => m.PublicoModule)},
	{ path: 'asistente', component: AsistenteComponent, 
		loadChildren: () => import('./pages/asistente/asistente.module').then((m) => m.AsistenteModule)},
	{ path: 'admin', component: AdminComponent, 
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
