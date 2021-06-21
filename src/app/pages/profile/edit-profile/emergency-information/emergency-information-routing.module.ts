import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmergencyInformationPage } from './emergency-information.page';

const routes: Routes = [
  {
    path: '',
    component: EmergencyInformationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmergencyInformationPageRoutingModule {}
