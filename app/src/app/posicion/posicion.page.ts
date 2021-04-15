import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';
//geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';
//controlador de pantalla cargando
import { LoadingController } from '@ionic/angular';
//importo el servicio de api rest
import { ApiRestGoogleService } from '../servicios/api-rest-google.service';
//segundo plano
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
//interface de nombre de las calles
import {Welcome2} from '../modelos/nombredirecciones-interface';
//variable de google
declare var google: any;
@Component({
  selector: 'app-posicion',
  templateUrl: './posicion.page.html',
  styleUrls: ['./posicion.page.scss'],
})
export class PosicionPage {

  logs: string[] = [];
  //variable del mapa
  mapRef = null;
  //renderizar en el mapa
  //latitud
  lat: any;
  //longitud
  lng: any;
  //nombrecalle
  nombre:any;
  
  //service = new google.maps.places.PlacesService(this.mapRef);
  directionsDisplay = new google.maps.DirectionsRenderer();
  constructor(

    private loadCtrl: LoadingController,
    private geolocation: Geolocation,
    private apiServices: ApiRestGoogleService,
    private backgroundMode: BackgroundMode

  ) {

    //segundo plano
    this.backgroundMode.disableWebViewOptimizations();
    this.backgroundMode.enable();
    this.backgroundMode.setEnabled(true);

   }

  //que se actualize cada que entro al boton
  ionViewDidEnter() {


    this.loadMap();
    /*setTimeout(() => {
     this.GETgeolocation()
    
    }, 15000);*/
    this.getNombreCalles();

  }
  private async loadMap() {

    
    //loading controler
    const loading = await this.loadCtrl.create();
    loading.present();
    const myLatng = await this.getLocation();
    //elemento del mapa
    const mapEle: HTMLElement = document.getElementById('map2');
    this.mapRef = new google.maps.Map(mapEle, {
      center: myLatng,
      zoom: 17
    });
    //el dispaly sea en este mapa
    this.directionsDisplay.setMap(this.mapRef);
    const image =
      "../assets/icon/standing-up-man-.png";
    const beachMarker = new google.maps.Marker({
      position: myLatng,
      map: this.mapRef,
      icon: image,
    });
    //notificacion que el mapa esta cargado
    google.maps.event.addListenerOnce(this.mapRef, 'idle', () => {
      console.log("mapa 2 cargado");
      //apagar el loding controller
      loading.dismiss();
    });

    //direciones a html
    this.lat=(myLatng.lat).toFixed(5);
    this.lng=(myLatng.lng).toFixed(5);
  }

  async getNombreCalles(){
    const latlng = await this.getLocation();
    this.apiServices.getDatosnombrecalles(latlng.lat,latlng.lng).subscribe((nombres:Welcome2)=>{
      this.nombre=nombres.results[0].address_components[1].short_name;
      console.log(this.nombre);
    });
  }

  private async getLocation() {
    //mapa 
    const rta = await this.geolocation.getCurrentPosition();
    console.log(rta.coords.latitude);
    console.log(rta.coords.longitude);
  
    return {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude

    };
  }


}
