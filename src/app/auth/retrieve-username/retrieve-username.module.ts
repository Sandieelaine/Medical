import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RetrieveUsernamePageRoutingModule } from './retrieve-username-routing.module';

import { RetrieveUsernamePage } from './retrieve-username.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RetrieveUsernamePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RetrieveUsernamePage]
})
export class RetrieveUsernamePageModule {}
