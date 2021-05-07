import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClaimsPage } from './claims.page';

const routes: Routes = [
  {
    path: '',
    component: ClaimsPage
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
export class ClaimsPageRoutingModule {}
