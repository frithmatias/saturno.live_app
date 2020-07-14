import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../modules/material.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ChatComponent } from './chat/chat.component';
import { MessageTimePipe } from '../pipes/message-time.pipe';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MessageTimePipe,
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
    MessageTimePipe,
    ToolbarComponent,
    SidenavComponent,
    ChatComponent
  ]
})
export class ComponentsModule { }
