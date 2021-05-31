import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectedOptionPage } from './selected-option.page';

const routes: Routes = [
  {
    path: '',
    component: SelectedOptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectedOptionPageRoutingModule {}
