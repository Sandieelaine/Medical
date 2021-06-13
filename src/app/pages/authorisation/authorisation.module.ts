import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthorisationPageRoutingModule } from './authorisation-routing.module';

import { AuthorisationPage } from './authorisation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthorisationPageRoutingModule
  ],
  declarations: [AuthorisationPage]
})
export class AuthorisationPageModule {}
