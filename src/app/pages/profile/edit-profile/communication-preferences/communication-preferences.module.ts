import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunicationPreferencesPageRoutingModule } from './communication-preferences-routing.module';

import { CommunicationPreferencesPage } from './communication-preferences.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationPreferencesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CommunicationPreferencesPage]
})
export class CommunicationPreferencesPageModule {}
