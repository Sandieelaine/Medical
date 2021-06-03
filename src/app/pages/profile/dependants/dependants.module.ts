import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DependantsPageRoutingModule } from './dependants-routing.module';

import { DependantsPage } from './dependants.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DependantsPageRoutingModule
  ],
  declarations: [DependantsPage]
})
export class DependantsPageModule {}
