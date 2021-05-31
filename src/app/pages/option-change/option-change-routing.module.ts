import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OptionChangePage } from './option-change.page';

const routes: Routes = [
  {
    path: '',
    component: OptionChangePage
  },
  {
    path: ':option/:status',
    loadChildren: () => import('./selected-option/selected-option.module').then( m => m.SelectedOptionPageModule)
  },
  {
    path: 'nonevo-option',
    loadChildren: () => import('./nonevo-option/nonevo-option.module').then( m => m.NonevoOptionPageModule)
  },
  {
    path: 'evo-option',
    loadChildren: () => import('./evo-option/evo-option.module').then( m => m.EvoOptionPageModule)
  },
  {
    path: 'selected-option',
    loadChildren: () => import('./selected-option/selected-option.module').then( m => m.SelectedOptionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptionChangePageRoutingModule {}
