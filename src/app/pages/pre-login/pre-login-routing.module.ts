import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreLoginPage } from './pre-login.page';

const routes: Routes = [
  {
    path: '',
    component: PreLoginPage
  },
  {
    path: 'option',
    loadChildren: () => import('./option/option.module').then( m => m.OptionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreLoginPageRoutingModule {}
