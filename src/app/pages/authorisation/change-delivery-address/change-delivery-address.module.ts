import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeDeliveryAddressPageRoutingModule } from './change-delivery-address-routing.module';

import { ChangeDeliveryAddressPage } from './change-delivery-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ChangeDeliveryAddressPageRoutingModule
  ],
  declarations: [ChangeDeliveryAddressPage]
})
export class ChangeDeliveryAddressPageModule {}
