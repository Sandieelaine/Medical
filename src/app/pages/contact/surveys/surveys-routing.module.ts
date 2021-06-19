import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveysPage } from './surveys.page';

const routes: Routes = [
  {
    path: '',
    component: SurveysPage
  },
  {
    path: 'new-enrollment',
    loadChildren: () => import('./new-enrollment/new-enrollment.module').then( m => m.NewEnrollmentPageModule)
  },
  {
    path: 'claims-amendments',
    loadChildren: () => import('./claims-amendments/claims-amendments.module').then( m => m.ClaimsAmendmentsPageModule)
  },
  {
    path: 'claims',
    loadChildren: () => import('./claims/claims.module').then( m => m.ClaimsPageModule)
  },
  {
    path: 'call-centre',
    loadChildren: () => import('./call-centre/call-centre.module').then( m => m.CallCentrePageModule)
  },
  {
    path: 'walk-in-centres',
    loadChildren: () => import('./walk-in-centres/walk-in-centres.module').then( m => m.WalkInCentresPageModule)
  },
  {
    path: 'communication',
    loadChildren: () => import('./communication/communication.module').then( m => m.CommunicationPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveysPageRoutingModule {}
