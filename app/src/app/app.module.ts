import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//geolocation
import {Geolocation} from '@ionic-native/geolocation/ngx';
//geolocalizacion

//httpclientmodule
import {HttpClientModule} from '@angular/common/http';

//bluetooth
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

//segundo plano
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

import { HTTP } from '@ionic-native/http/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    BluetoothSerial,
    BackgroundMode,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
