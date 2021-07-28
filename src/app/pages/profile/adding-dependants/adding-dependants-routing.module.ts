import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddingDependantsPage } from './adding-dependants.page';

const routes: Routes = [
  {
    path: '',
    component: AddingDependantsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddingDependantsPageRoutingModule {}
