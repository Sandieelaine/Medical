import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallCentrePage } from './call-centre.page';

const routes: Routes = [
  {
    path: '',
    component: CallCentrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallCentrePageRoutingModule {}
