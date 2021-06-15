import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComplimentsPage } from './compliments.page';

const routes: Routes = [
  {
    path: '',
    component: ComplimentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplimentsPageRoutingModule {}
