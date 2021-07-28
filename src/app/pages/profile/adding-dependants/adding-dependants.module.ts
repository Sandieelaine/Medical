import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddingDependantsPageRoutingModule } from './adding-dependants-routing.module';

import { AddingDependantsPage } from './adding-dependants.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddingDependantsPageRoutingModule
  ],
  declarations: [AddingDependantsPage]
})
export class AddingDependantsPageModule {}
