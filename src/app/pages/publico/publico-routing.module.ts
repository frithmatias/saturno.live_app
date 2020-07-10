import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TurnosComponent } from './turnos/turnos.component';
import { PantallaComponent } from './pantalla/pantalla.component';

const publicRoutes: Routes = [
	{ path: 'turnos', component: TurnosComponent },
	{ path: 'pantalla', component: PantallaComponent },
	{ path: '', redirectTo: '/publico', pathMatch: 'full' }

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(publicRoutes)], 
  exports: [RouterModule]
})
export class PublicoRoutingModule { }
