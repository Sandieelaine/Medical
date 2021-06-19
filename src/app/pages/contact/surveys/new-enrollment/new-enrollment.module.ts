import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewEnrollmentPageRoutingModule } from './new-enrollment-routing.module';

import { NewEnrollmentPage } from './new-enrollment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewEnrollmentPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewEnrollmentPage]
})
export class NewEnrollmentPageModule {}
