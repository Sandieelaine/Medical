import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalkInCentresPageRoutingModule } from './walk-in-centres-routing.module';

import { WalkInCentresPage } from './walk-in-centres.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalkInCentresPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [WalkInCentresPage]
})
export class WalkInCentresPageModule {}
