import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EvoOptionPageRoutingModule } from './evo-option-routing.module';

import { EvoOptionPage } from './evo-option.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvoOptionPageRoutingModule
  ],
  declarations: [EvoOptionPage]
})
export class EvoOptionPageModule {}
