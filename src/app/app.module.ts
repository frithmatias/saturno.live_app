import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ROUTES
import { AppRoutingModule } from './app-routing.module';

// SOCKET.IO 
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// ENV
import { environment } from '../environments/environment';

// CONF
const config: SocketIoConfig = { url: environment.url, options: {} };

// COMPONENTS
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';

// MODULES
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './modules/material.module';


@NgModule({
	declarations: [
		AppComponent,
		RegistroComponent,
		LoginComponent,
		NopagefoundComponent
	],
	imports: [
		MaterialModule,
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		AppRoutingModule,
		SocketIoModule.forRoot(config)
	],
	exports: [],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
