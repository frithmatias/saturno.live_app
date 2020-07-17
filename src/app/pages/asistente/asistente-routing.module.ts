import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesktopComponent } from './desktop/desktop.component';
import { NopagefoundComponent } from '../nopagefound/nopagefound.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const assistantRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'escritorio/:id', component: DesktopComponent },
  { path: 'dashboard', component: DashboardComponent },
	{ path: '', redirectTo: '/asistente/home', pathMatch: 'full' },
  { path: '**', component: NopagefoundComponent}
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(assistantRoutes)], 
  exports: [RouterModule]
})
export class AsistenteRoutingModule { }
