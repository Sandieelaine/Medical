import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProfilePage } from './edit-profile.page';

const routes: Routes = [
  {
    path: '',
    component: EditProfilePage
  },
  {
    path: 'personal-information/:guid',
    loadChildren: () => import('./personal-information/personal-information.module').then( m => m.PersonalInformationPageModule)
  },
  {
    path: 'contact-information/:guid',
    loadChildren: () => import('./contact-information/contact-information.module').then( m => m.ContactInformationPageModule)
  },
  {
    path: 'emergency-information/:guid',
    loadChildren: () => import('./emergency-information/emergency-information.module').then( m => m.EmergencyInformationPageModule)
  },
  {
    path: 'change-username/:guid',
    loadChildren: () => import('./change-username/change-username.module').then( m => m.ChangeUsernamePageModule)
  },
  {
    path: 'change-password/:guid',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'communication-preferences/:guid',
    loadChildren: () => import('./communication-preferences/communication-preferences.module').then( m => m.CommunicationPreferencesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProfilePageRoutingModule {}
