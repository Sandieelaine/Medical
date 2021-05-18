import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CentresPage } from './centres.page';

const routes: Routes = [
  {
    path: '',
    component: CentresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CentresPageRoutingModule {}
