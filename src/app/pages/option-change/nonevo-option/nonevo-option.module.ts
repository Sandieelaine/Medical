import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonevoOptionPageRoutingModule } from './nonevo-option-routing.module';

import { NonevoOptionPage } from './nonevo-option.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonevoOptionPageRoutingModule
  ],
  declarations: [NonevoOptionPage]
})
export class NonevoOptionPageModule {}
