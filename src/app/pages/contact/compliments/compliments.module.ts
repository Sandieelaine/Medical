import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComplimentsPageRoutingModule } from './compliments-routing.module';

import { ComplimentsPage } from './compliments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComplimentsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ComplimentsPage]
})
export class ComplimentsPageModule {}
