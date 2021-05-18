import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CentresPageRoutingModule } from './centres-routing.module';

import { CentresPage } from './centres.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CentresPageRoutingModule
  ],
  declarations: [CentresPage]
})
export class CentresPageModule {}
