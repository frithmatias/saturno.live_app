import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TurnosComponent } from './turnos/turnos.component';
import { PantallaComponent } from './pantalla/pantalla.component';
import { HomePublicoComponent } from './home-publico/home-publico.component';
import { NopagefoundComponent } from '../nopagefound/nopagefound.component';
import { PublicoComponent } from './publico.component';

const publicRoutes: Routes = [
	{ path: 'turnos', component: TurnosComponent },
  { path: 'pantalla', component: PantallaComponent },
  { path: '', component: HomePublicoComponent },
  { path: ':userCompanyName', component: PublicoComponent },
  { path: '**', component: NopagefoundComponent}

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(publicRoutes)], 
  exports: [RouterModule]
})
export class PublicoRoutingModule { }
