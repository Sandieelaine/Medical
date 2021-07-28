import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeDeliveryAddressPage } from './change-delivery-address.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeDeliveryAddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeDeliveryAddressPageRoutingModule {}
