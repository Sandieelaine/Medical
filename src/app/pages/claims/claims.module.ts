import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClaimsPageRoutingModule } from './claims-routing.module';
import { ClaimsPage } from './claims.page';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClaimsPageRoutingModule
  ],
  declarations: [ClaimsPage],
  providers: [FileOpener, File]
})
export class ClaimsPageModule {}
