import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClaimsLandingPageRoutingModule } from './claims-landing-routing.module';
import { ClaimsLandingPage } from './claims-landing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClaimsLandingPageRoutingModule
  ],
  declarations: [ClaimsLandingPage]
})
export class ClaimsLandingPageModule {}
