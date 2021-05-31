import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonevoOptionPage } from './nonevo-option.page';

const routes: Routes = [
  {
    path: '',
    component: NonevoOptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonevoOptionPageRoutingModule {}
