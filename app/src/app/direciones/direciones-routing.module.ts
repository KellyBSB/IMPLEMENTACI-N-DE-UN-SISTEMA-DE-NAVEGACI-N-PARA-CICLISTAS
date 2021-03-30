import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DirecionesPage } from './direciones.page';

const routes: Routes = [
  {
    path: '',
    component: DirecionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirecionesPageRoutingModule {}
