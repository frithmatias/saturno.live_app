import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatIconModule
  ]
})
export class MaterialModule { }
