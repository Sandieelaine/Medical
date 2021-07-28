import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DependantPageRoutingModule } from './dependant-routing.module';

import { DependantPage } from './dependant.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DependantPageRoutingModule
  ],
  declarations: [DependantPage]
})
export class DependantPageModule {}
