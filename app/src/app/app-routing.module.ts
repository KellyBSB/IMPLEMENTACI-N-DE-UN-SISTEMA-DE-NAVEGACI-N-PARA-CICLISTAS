import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'bluetooth',
    pathMatch: 'full',
  },
  {
    path: 'posicion',
    loadChildren: () => import('./posicion/posicion.module').then( m => m.PosicionPageModule)
  },
  {
    path: 'direciones',
    loadChildren: () => import('./direciones/direciones.module').then( m => m.DirecionesPageModule)
  },
  {
    path: 'bluetooth',
    loadChildren: () => import('./bluetooth/bluetooth.module').then( m => m.BluetoothPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
