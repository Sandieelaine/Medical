import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmergencyInformationPageRoutingModule } from './emergency-information-routing.module';

import { EmergencyInformationPage } from './emergency-information.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmergencyInformationPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EmergencyInformationPage]
})
export class EmergencyInformationPageModule {}
