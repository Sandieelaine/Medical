import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SelectedOptionPageRoutingModule } from './selected-option-routing.module';
import { SelectedOptionPage } from './selected-option.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectedOptionPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SelectedOptionPage]
})
export class SelectedOptionPageModule {}
