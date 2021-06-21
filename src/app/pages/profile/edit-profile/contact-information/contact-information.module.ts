import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactInformationPageRoutingModule } from './contact-information-routing.module';

import { ContactInformationPage } from './contact-information.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactInformationPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ContactInformationPage]
})
export class ContactInformationPageModule {}
