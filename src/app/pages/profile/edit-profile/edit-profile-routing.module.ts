import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProfilePage } from './edit-profile.page';

const routes: Routes = [
  {
    path: '',
    component: EditProfilePage
  },
  {
    path: 'personal-information',
    loadChildren: () => import('./personal-information/personal-information.module').then( m => m.PersonalInformationPageModule)
  },
  {
    path: 'contact-information',
    loadChildren: () => import('./contact-information/contact-information.module').then( m => m.ContactInformationPageModule)
  },
  {
    path: 'emergency-information',
    loadChildren: () => import('./emergency-information/emergency-information.module').then( m => m.EmergencyInformationPageModule)
  },
  {
    path: 'change-username',
    loadChildren: () => import('./change-username/change-username.module').then( m => m.ChangeUsernamePageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'communication-preferences',
    loadChildren: () => import('./communication-preferences/communication-preferences.module').then( m => m.CommunicationPreferencesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProfilePageRoutingModule {}
