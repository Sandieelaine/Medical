
import {NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StripComponent } from './strip/strip.component';
  
  @NgModule({
    imports: [CommonModule, IonicModule],
    declarations: [StripComponent],
    exports: [StripComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
  })
  export class ComponentsModule{}
  