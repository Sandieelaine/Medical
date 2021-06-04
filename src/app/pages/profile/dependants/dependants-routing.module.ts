import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DependantsPage } from './dependants.page';

const routes: Routes = [
  {
    path: '',
    component: DependantsPage
  },
  {
    path: 'dependant/:Dependant',
    loadChildren: () => import('./dependant/dependant.module').then( m => m.DependantPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DependantsPageRoutingModule {}
