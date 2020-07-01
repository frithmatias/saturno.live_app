import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EscritorioComponent } from './pages/escritorio/escritorio.component';
import { HomeComponent } from './pages/home/home.component';
import { NuevoTicketComponent } from './pages/nuevo-ticket/nuevo-ticket.component';
import { PublicoComponent } from './pages/publico/publico.component';

const routes: Routes = [
	{ path: 'escritorio/:id', component: EscritorioComponent },
	{ path: 'home', component: HomeComponent },
	{ path: 'nuevo-ticket', component: NuevoTicketComponent },
	{ path: 'publico', component: PublicoComponent },
	{ path: '**', component: HomeComponent }
];

@NgModule({
	declarations: [],
	imports: [ RouterModule.forRoot(routes), CommonModule ],
	exports: [
		RouterModule 
	]
})
export class AppRoutingModule {}
