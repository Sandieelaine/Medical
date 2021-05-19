import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestCardPage } from './request-card.page';

const routes: Routes = [
  {
    path: '',
    component: RequestCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestCardPageRoutingModule {}
