import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunicationPreferencesPage } from './communication-preferences.page';

const routes: Routes = [
  {
    path: '',
    component: CommunicationPreferencesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationPreferencesPageRoutingModule {}
