import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallCentrePageRoutingModule } from './call-centre-routing.module';

import { CallCentrePage } from './call-centre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallCentrePageRoutingModule
  ],
  declarations: [CallCentrePage]
})
export class CallCentrePageModule {}
