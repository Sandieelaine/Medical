import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DependantPage } from './dependant.page';

const routes: Routes = [
  {
    path: '',
    component: DependantPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DependantPageRoutingModule {}
