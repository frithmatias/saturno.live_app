import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		MatToolbarModule,
		MatSidenavModule,
		MatIconModule,
		MatButtonModule,
		MatSnackBarModule,
		MatInputModule,
		MatBadgeModule
	],
	exports: [
		CommonModule,
		MatToolbarModule,
		MatSidenavModule,
		MatIconModule,
		MatButtonModule,
		MatSnackBarModule,
		MatInputModule,
		MatBadgeModule
	]
})
export class MaterialModule { }
