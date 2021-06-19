import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClaimsAmendmentsPage } from './claims-amendments.page';

const routes: Routes = [
  {
    path: '',
    component: ClaimsAmendmentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimsAmendmentsPageRoutingModule {}
