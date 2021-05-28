import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClaimsHomePage } from './claims-home.page';

const routes: Routes = [
  {
    path: '',
    component: ClaimsHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimsHomePageRoutingModule {}
