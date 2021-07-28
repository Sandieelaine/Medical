import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorisationPage } from './authorisation.page';

const routes: Routes = [
  {
    path: '',
    component: AuthorisationPage
  },
  {
    path: 'request',
    loadChildren: () => import('./request/request.module').then( m => m.RequestPageModule)
  },
  {
    path: 'change-delivery-address',
    loadChildren: () => import('./change-delivery-address/change-delivery-address.module').then( m => m.ChangeDeliveryAddressPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorisationPageRoutingModule {}
