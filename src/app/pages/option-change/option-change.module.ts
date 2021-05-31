import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptionChangePageRoutingModule } from './option-change-routing.module';

import { OptionChangePage } from './option-change.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptionChangePageRoutingModule
  ],
  declarations: [OptionChangePage]
})
export class OptionChangePageModule {}
