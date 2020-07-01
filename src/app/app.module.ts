// ENV
import { environment } from '../environments/environment.prod';

// MODULES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// COMPONENTS
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PublicoComponent } from './pages/publico/publico.component';
import { NuevoTicketComponent } from './pages/nuevo-ticket/nuevo-ticket.component';
import { EscritorioComponent } from './pages/escritorio/escritorio.component';

// SOCKETS
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// PIPES
import { DomseguroPipe } from './pipes/domseguro.pipe';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

import { MatIconModule } from '@angular/material/icon';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

const config: SocketIoConfig = { url: environment.url, options: {} };

@NgModule({
	declarations: [
		AppComponent,
		EscritorioComponent,
		HomeComponent,
		NuevoTicketComponent,
		PublicoComponent,
		DomseguroPipe,
		SidenavComponent,
		ToolbarComponent],
	imports: [
		BrowserModule,
		// MaterialModule,
		FormsModule,
		AppRoutingModule,
		HttpClientModule,
		SocketIoModule.forRoot(config),
		BrowserAnimationsModule,
		MatToolbarModule,
		MatSidenavModule,
		MatIconModule,
		MatButtonModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
