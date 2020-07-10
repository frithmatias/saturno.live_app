import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../modules/material.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ChatComponent } from './chat/chat.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ToolbarComponent,
    SidenavComponent,
    ChatComponent
  ],
  imports: [
		RouterModule,
    CommonModule,
    MaterialModule
   ],
  exports: [
    ToolbarComponent,
    SidenavComponent,
    ChatComponent
  ]
})
export class ComponentsModule { }
