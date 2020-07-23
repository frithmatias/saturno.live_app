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
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

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
		MatBadgeModule,
		MatListModule,
		MatSelectModule
	],
	exports: [
		CommonModule,
		MatToolbarModule,
		MatSidenavModule,
		MatIconModule,
		MatButtonModule,
		MatSnackBarModule,
		MatInputModule,
		MatBadgeModule,
		MatListModule,
		MatSelectModule
	]
})
export class MaterialModule { }
