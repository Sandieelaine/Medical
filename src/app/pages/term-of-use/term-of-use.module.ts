import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermOfUsePageRoutingModule } from './term-of-use-routing.module';

import { TermOfUsePage } from './term-of-use.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermOfUsePageRoutingModule
  ],
  declarations: [TermOfUsePage]
})
export class TermOfUsePageModule {}
