import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalkInCentresPage } from './walk-in-centres.page';

const routes: Routes = [
  {
    path: '',
    component: WalkInCentresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalkInCentresPageRoutingModule {}
