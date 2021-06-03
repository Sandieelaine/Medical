import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DependantsPage } from './dependants.page';

const routes: Routes = [
  {
    path: '',
    component: DependantsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DependantsPageRoutingModule {}
