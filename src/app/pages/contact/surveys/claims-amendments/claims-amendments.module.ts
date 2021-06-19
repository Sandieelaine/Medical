import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClaimsAmendmentsPageRoutingModule } from './claims-amendments-routing.module';

import { ClaimsAmendmentsPage } from './claims-amendments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClaimsAmendmentsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ClaimsAmendmentsPage]
})
export class ClaimsAmendmentsPageModule {}
