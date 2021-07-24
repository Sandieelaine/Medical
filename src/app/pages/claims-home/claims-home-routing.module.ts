import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClaimsHomePage } from './claims-home.page';

const routes: Routes = [
  {
    path: '',
    component: ClaimsHomePage
  },
  {
    path: ':claimID',
    loadChildren: () => import('./claim/claim.module').then( m => m.ClaimPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimsHomePageRoutingModule {}
