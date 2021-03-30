import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosicionPage } from './posicion.page';

const routes: Routes = [
  {
    path: '',
    component: PosicionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosicionPageRoutingModule {}
