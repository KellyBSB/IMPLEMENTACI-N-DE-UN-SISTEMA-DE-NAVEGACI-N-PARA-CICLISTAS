//oninit inizializar una tarea adicional
import { Component, OnInit } from '@angular/core';
//geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';
//variable de google
declare var google: any;
//touter
import { Router } from '@angular/router';
//controlador de pantalla cargando
import { LoadingController } from '@ionic/angular';

//controlador de alerta
import { AlertController,ToastController } from '@ionic/angular';
//importo el servicio de api rest
import { ApiRestGoogleService } from '../servicios/api-rest-google.service'

//segundo plano
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
//interface dentro del distrito
import {Welcome3} from '../modelos/dentrodeldistrito-interface';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //variable del mapa
  mapRef = null;
  //marcador para destino
  _markers = [];
  _latLngDestino: any;
  //ruta optima
  directionsService = new google.maps.DirectionsService();
  //renderizar en el mapa
  directionsDisplay = new google.maps.DirectionsRenderer();
  //en el distrito 
  distrito: any;
  //dentro
  dentro: boolean = false;
  //tamaño
  tamaño: number;
  //si se crea laruta se puede comenzar
  buttonDisabledDireciones: string="noentra";
  //el origen esta dentro de quito
  origenEnQuito:boolean=false;
  //pasar por esta boolean a el boton comenzar
  comezarcomenzar:boolean=false;
  //constructor
  constructor(private geolocation: Geolocation,
    private loadCtrl: LoadingController,
    public alertController: AlertController,
    private apiServices: ApiRestGoogleService,
    private toastcontroller:ToastController,
    private backgroundMode: BackgroundMode,
    private router: Router
  ) { 

//segundo plano
this.backgroundMode.disableWebViewOptimizations();
this.backgroundMode.enable();
this.backgroundMode.setEnabled(true);

this.presentAlert()
  }

  //ver cuando se cargo la pagina e inicializar otros eventos
  //una vez que se cargo todo  no lo vuelve a cargar
  async  ionViewDidEnter() {
    //borrar storage que exista
  localStorage.clear();
   await this.loadMap();
  }
  //ventana emergente
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Inicar ruta',
      message: 'Marque la ruta destino destro del Distrito Metropolitano de Quito para continuar',
      buttons: ['ok']
    });

    await alert.present();
  }
  //cagar mapa
  async loadMap() {
    //elemento del mapa
    const mapEle: HTMLElement = document.getElementById('map');
    //loading controler
    const loading = await this.loadCtrl.create();
    loading.present();
    //position
    const myLatng = await this.getLocation();
    //mandar datos a la pagina direcciones
    localStorage.setItem('latitudOrigen', (myLatng.lat).toString());
    localStorage.setItem('longitudOrigen', (myLatng.lng).toString());
    //mapa de google
    this.mapRef = new google.maps.Map(mapEle, {
      Center: myLatng,
      zoom: 15
    });
    //el dispaly sea en este mapa
    this.directionsDisplay.setMap(this.mapRef);
    //notificacion que el mapa esta cargado
    google.maps.event.addListenerOnce(this.mapRef, 'idle', () => {
      //apagar el loding controller
      loading.dismiss();
      this.addMarker(myLatng.lat, myLatng.lng, 0);
    });
    //tomar en cuenta el marcador para el destino
    google.maps.event.addListener(this.mapRef, 'click', (event) => {
      //mandar datos destino al marcador
      this.addMarker(event.latLng.lat(), event.latLng.lng(), 1);
      //mandar datos destino para verificar que este destro del distrito
      this.getNombreCalles(event.latLng.lat(), event.latLng.lng());
      //mandar bandera o señal de que se señalo el destino
      this.comezarcomenzar=true;
    });
  
  }
//funcion para añadir marcadores
  private addMarker(lat: number, lng: number, index: number) {
    //marker de mi posicion actual
    const marker = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng
      },
      zoom: 8,
      map: this.mapRef,
      title: 'Yo'
    });
    //borrar los marcadores que esan demas, deja solo un marcador destino   
    if (index > 0 && this._markers[1]) {
      this._markers[1].setMap(null);
    }
    // we need to push makers to array. we need these references to remove our marker later
    //necesitamos estas referencias para eliminar nuestro marcador más tarde
    this._markers[index] = marker;
    //si hay una direcion destino asignar a la varaible direcion destino
    if (index > 0) {
      this._latLngDestino = {
        lat,
        lng
      };
      //enviar coordenas destino a la pagina direciones
      localStorage.setItem('latitudDestino', (this._latLngDestino.lat).toString());
      localStorage.setItem('longitudDestino', (this._latLngDestino.lng).toString());
      console.log("destino " + this._latLngDestino.lat, this._latLngDestino.lng);
      //llamar a la funcion para que calcule la ruta
      this.calculateRoute();
    }
  }

  private async getLocation() {
    //lat y lng de mi ubicacion actual
    const rta = await this.geolocation.getCurrentPosition();
    console.log(rta.coords.latitude);
    console.log(rta.coords.longitude);
    //ver si el origen esta dentro de quito
    this.origindentroDEquito(rta.coords.latitude,rta.coords.longitude);
    return {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };
  }

  //funcion realiza la ruta
  private async calculateRoute() {
    //datos de origen y destino
    const myLatLng = await this.getLocation();
    const myLatLngdestino = this._latLngDestino;
    //realiza la ruta y su modo en este caso via vehiculo
    this.directionsService.route({
      origin: myLatLng,
      destination: myLatLngdestino,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    //mensaje de error al no cargarse el mapa
      (response, status) => {

        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsDisplay.setDirections(response);
        } else {
          alert('No se pudo cargar el mapa: ' + status);
        }

      }
    );



  }


  //funcion para verifivar que el destino esta dentro del distrito metropolitano de Quito
  getNombreCalles(lat?, lng?) {

    this.apiServices.getDatosdestrodeldistrito(lat, lng).subscribe((nombres:Welcome3) => {
      this.tamaño = nombres.results[0].address_components.length;
      console.log(this.tamaño);
      (document.getElementById("btn")as HTMLButtonElement).disabled = true; 
      for (let i = 0; i < this.tamaño; i++) {
        this.distrito = nombres.results[0].address_components[i].short_name;
        console.log(this.distrito);
        if (this.origenEnQuito && (this.distrito === "Metropolitan District of Quito" || this.distrito === "Distrito Metropolitano de Quito")) {
          (document.getElementById("btn")as HTMLButtonElement).disabled = false; 
        }
      }
    });
  }

  //funcion para verifivar que el origen esta dentro del distrito metropolitano de Quito

origindentroDEquito(lat,lng){
  this.apiServices.getDatosdestrodeldistrito(lat, lng).subscribe((nombres:Welcome3) => {
    this.tamaño = nombres.results[0].address_components.length;
    this.origenEnQuito=false; 
    for (let i = 0; i < this.tamaño; i++) {
      this.distrito = nombres.results[0].address_components[i].short_name;
      console.log(this.distrito);
      if (this.distrito === "Metropolitan District of Quito" || this.distrito === "Distrito Metropolitano de Quito") {
      this.origenEnQuito=true;  
    }
    }
  });


}

//funcion del boton siguiente
iraDirecioes(){
  this.router.navigate(['/direciones']);
  //verifica si hay un lugar destino y que este este dentro del distrito
  if(this.comezarcomenzar){
    this.buttonDisabledDireciones="entra";
    localStorage.setItem('hayruta', (this.buttonDisabledDireciones));
  }
}

    //mirar mensaje
async mirarmensaje(mensaje){
  const toast = await this.toastcontroller.create({
    message:mensaje,
    duration:3000
  });
  toast.present()

}

}
