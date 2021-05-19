import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RequestCardPageRoutingModule } from './request-card-routing.module';
import { RequestCardPage } from './request-card.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestCardPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RequestCardPage]
})
export class RequestCardPageModule {}
