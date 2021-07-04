import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardPageRoutingModule } from './card-routing.module';
import { CardPage } from './card.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { DigitalMemberCardComponent } from 'src/app/components/digital-member-card/digital-member-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardPageRoutingModule
  ],
  declarations: [CardPage, DigitalMemberCardComponent],
  providers: [ScreenOrientation]
})
export class CardPageModule {}
