import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClaimsHomePage } from './claims-home.page';

const routes: Routes = [
  {
    path: '',
    component: ClaimsHomePage
  },
  {
    path: 'claim/:claimID',
    loadChildren: () => import('./claim/claim.module').then( m => m.ClaimPageModule)
  },
  {
    path: 'statements',
    loadChildren: () => import('../claims/claims.module').then( m => m.ClaimsPageModule)
  },
  {
    path: 'submit',
    loadChildren: () => import('../submit-claim/submit-claim.module').then( m => m.SubmitClaimPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimsHomePageRoutingModule {}
