import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClaimsLandingPage } from './claims-landing.page';

const routes: Routes = [
  {
    path: '',
    component: ClaimsLandingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimsLandingPageRoutingModule {}
