import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClaimsHomePageRoutingModule } from './claims-home-routing.module';

import { ClaimsHomePage } from './claims-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClaimsHomePageRoutingModule
  ],
  declarations: [ClaimsHomePage]
})
export class ClaimsHomePageModule {}
