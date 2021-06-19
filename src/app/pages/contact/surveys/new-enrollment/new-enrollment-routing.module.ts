import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewEnrollmentPage } from './new-enrollment.page';

const routes: Routes = [
  {
    path: '',
    component: NewEnrollmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewEnrollmentPageRoutingModule {}
