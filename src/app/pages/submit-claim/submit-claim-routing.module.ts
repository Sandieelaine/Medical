import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmitClaimPage } from './submit-claim.page';

const routes: Routes = [
  {
    path: '',
    component: SubmitClaimPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmitClaimPageRoutingModule {}
