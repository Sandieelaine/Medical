import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RetrieveUsernamePage } from './retrieve-username.page';

const routes: Routes = [
  {
    path: '',
    component: RetrieveUsernamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RetrieveUsernamePageRoutingModule {}
