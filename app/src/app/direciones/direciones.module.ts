import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DirecionesPageRoutingModule } from './direciones-routing.module';

import { DirecionesPage } from './direciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirecionesPageRoutingModule
  ],
  declarations: [DirecionesPage]
})
export class DirecionesPageModule {}
