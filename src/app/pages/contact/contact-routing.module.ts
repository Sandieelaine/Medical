import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactPage } from './contact.page';

const routes: Routes = [
  {
    path: '',
    component: ContactPage
  },
  {
    path: 'walk-in-centres',
    loadChildren: () => import('../centres/centres.module').then(m => m.CentresPageModule)
  },
  {
    path: 'compliments',
    loadChildren: () => import('./compliments/compliments.module').then( m => m.ComplimentsPageModule)
  },
  {
    path: 'survey',
    loadChildren: () => import('./surveys/survey/survey.module').then( m => m.SurveyPageModule)
  },
  {
    path: 'surveys',
    loadChildren: () => import('./surveys/surveys.module').then( m => m.SurveysPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactPageRoutingModule {}
