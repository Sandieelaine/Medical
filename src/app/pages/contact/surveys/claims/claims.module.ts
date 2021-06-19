import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClaimsPageRoutingModule } from './claims-routing.module';

import { ClaimsPage } from './claims.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClaimsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ClaimsPage]
})
export class ClaimsPageModule {}
