import { Component, OnInit, OnDestroy } from '@angular/core';
//importo el servicio de api rest
import { ApiRestGoogleService } from '../servicios/api-rest-google.service'
//geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';
//bluetooth
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
//alertas
import { AlertController, ToastController } from '@ionic/angular';

//segundo plano
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
//interface de ubicacion actual
import { Welcome1 } from '../modelos/json-interface-ubicacionActual';

@Component({
  selector: 'app-direciones',
  templateUrl: './direciones.page.html',
  styleUrls: ['./direciones.page.scss'],
})
export class DirecionesPage implements OnDestroy {


  //enviar datos
  enviodatos: boolean;
  //cambiar la ruta en el mapa
  camRuta: string = "puedecambiar";

  //variables para los mensajes de las dirreciones
  aString: any;
  aStringDerecha: any;
  aStringIzquierda: any;
  aStringcominzo: any;
  aStringdiferentes: any;
  aStringdiferentes1: any;

  //datos de la pagian home
  latitudOrigen: number;
  longitudOrigen: number;
  latitudDestino: number;
  longitudDestino: number;

  //variables para el manedo de datos

  public instruciones: any = [];

  private latdestino: number;
  private lngdestino: number;

  private loop: any;
  private contador: number = 0;

  private sub$: any;

  public externalposicion: any = [];


  //dispositivo conectado a bluetooth para empezar
  dispositivoConectado: boolean = false;

  lat: any;
  lng: any;

  //dejar comenzar
  buttonDisabledDireciones: string;
  buttonDisabled: boolean = true;

  contadorexterno: any;
  desactivar = true;
  mensajecorto: string;


  //constructor

  constructor(

    private apiServices: ApiRestGoogleService,
    private geolocation: Geolocation,
    private bluetoothSerial: BluetoothSerial,
    private alertController: AlertController,
    private toastcontroller: ToastController,
    private backgroundMode: BackgroundMode

  ) {

    //segundo plano
    this.backgroundMode.disableWebViewOptimizations();
    this.backgroundMode.enable();
    this.backgroundMode.setEnabled(true);

  }


  //recargar la pagina cada que se entre
  ionViewDidEnter() {
    this.sedebeIniciar();
  }

  //verificar si hay datos para comenzar la ruta
  sedebeIniciar() {
    const lat0 = localStorage.getItem('latitudOrigen');
    const lng0 = localStorage.getItem('longitudOrigen');
    const lat1 = localStorage.getItem('latitudDestino');
    const lng1 = localStorage.getItem('longitudDestino');
    if (lat0 != null && lat0 != undefined && lng0 != null && lng0 != undefined
      && lat1 != null && lat1 != undefined && lng1 != null && lng1 != undefined) {

      this.latitudOrigen = Number(localStorage.getItem('latitudOrigen'));
      this.longitudOrigen = Number(localStorage.getItem('longitudOrigen'));
      this.latitudDestino = Number(localStorage.getItem('latitudDestino'));
      this.longitudDestino = Number(localStorage.getItem('longitudDestino'));
      console.log(" pagina de inicio latiturd origen " + this.latitudOrigen);
      console.log(" pagina  de inicio longitud origen" + this.longitudOrigen);
      console.log(" destino " + this.latitudDestino);
      console.log(" destino " + this.longitudDestino);

      console.log("Resive datos");
    } else {
      this.mirarmensaje("Selecione una ruta");
    }
  }

  //validacion de boton
  activarComienzo() {
    this.buttonDisabledDireciones = localStorage.getItem('hayruta');
    if (this.buttonDisabledDireciones === "entra") {
      /*if(this.dispositivoConectado===true){
         this.getDtosApiGoogleDireciones();
       }else{
         this.mirarmensaje("Conecte al dispositivo bluetooth");
       } */
      this.getDtosApiGoogleDireciones();
    } else {
      this.mirarmensaje("Selecione la ruta para iniciar o click en el boton siguiente");
    }
  }

//segunda funcion a llamar para comparar los puntos de toda la ruta
  async startProceso(steps: any) {
    this.loop = setInterval(() => {

      if (this.contador < steps.length) {
        this.getLocation().then((pos) => {
          this.lat = pos.lat;
          this.lng = pos.lng;
          this.latdestino = steps[this.contador].end_location.lat;
          this.lngdestino = steps[this.contador].end_location.lng;
          console.error(`posicion actual ${this.lat},${this.lng}`);
          console.error(`posicion destino ${this.latdestino},${this.lngdestino}`);
          this.apiServices.getPosicionActual(this.lat, this.lng, this.latdestino, this.lngdestino).subscribe((posicion: Welcome1) => {
            this.externalposicion = posicion;
            console.log(posicion);
            if (posicion.status === "OK") {
              if (posicion.rows[0].elements[0].status === "OK") {
                //combertir a string para buscar la palabra clave
                this.aString = JSON.stringify(steps[this.contador].html_instructions).replace(/"/g, " ").replace(/</g, " ").replace(/>/g, " ").replace(/b/g, " ").replace('/', "").replace('/', "").replace('/', "").replace(/style/g, "").replace(/div/g, "").replace(/=/g, "").replace(/font-size:0.9em/g, "");
                console.log(this.aString);
                //si gira a ala derecha
                this.aStringDerecha = JSON.stringify(steps[this.contador].html_instructions).includes("right");
                //si gira a ala izquierda
                this.aStringIzquierda = JSON.stringify(steps[this.contador].html_instructions).includes("left");
                //continue
                this.aStringcominzo = JSON.stringify(steps[this.contador].html_instructions).includes("Head");
                //otra coda ve telefono
                this.aStringdiferentes = JSON.stringify(steps[this.contador].html_instructions).includes("roundabout");
                //peatones
                this.aStringdiferentes1 = JSON.stringify(steps[this.contador].html_instructions).includes(" Take the pedestrian overpass");

                //condicionales para el envio de datos por bluetooth
                if ((this.aStringdiferentes || this.aStringdiferentes1) && !this.enviodatos) {
                  this.mensajecorto = "Mire el telefono";
                  this.setData4();
                  this.enviodatos = true;
                }
                if (this.aStringcominzo && !this.enviodatos) {
                  this.mensajecorto = "Siga recto";
                  this.setData3();
                  this.enviodatos = true;
                }
                if (this.aStringDerecha && !this.enviodatos) {
                  this.mensajecorto = "Gire a la derecha";
                  this.setData();
                  this.enviodatos = true;
                }
                if (this.aStringIzquierda && !this.enviodatos) {
                  this.mensajecorto = "Gire a la izquierda";
                  this.setData1();
                  this.enviodatos = true;
                }


                if (posicion.rows[0].elements[0].distance.value < 30) {
                  if ((this.contador == steps.length - 1) && posicion.rows[0].elements[0].distance.value < 5) {
                    this.mensajecorto = "Llego a su destino";
                    this.setData3();
                    localStorage.clear();
                  }
                  this.enviodatos = false;
                  this.contador++;
                }

              }

            }

          });
        });
      } else {
        clearInterval(this.loop);
      }
    }, 1000);
  }


//primera funcion a llamar para obtener la ruta
  async getDtosApiGoogleDireciones() {
    this.mirarmensaje("Comienzo de ruta");
    const latlng = await this.getLocation();
    this.lat = latlng.lat;
    this.lng = latlng.lng;
    this.sub$ = this.apiServices.getDtosApiGoogle(this.latitudOrigen, this.longitudOrigen, this.latitudDestino, this.longitudDestino).subscribe((datos) => {
      //steps
      this.instruciones = datos.routes[0].legs[0].steps;
      console.log(this.instruciones);
      this.startProceso(this.instruciones);
    });

  }

  //funcion para obtener la posicion actual de usuario
  private async getLocation(): Promise<any> {
    //mapa 
    const rta = await this.geolocation.getCurrentPosition();

    return {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };
  }

  //bboton que ayudara a cancelar al comienzo sw la ruta
  cancelar() {
    clearInterval(this.loop);
    this.aString = "";
    this.mensajecorto = "";
    //borra todo en local storage
    localStorage.clear();
    this.mirarmensaje("Se cancelo la ruta");
  }



  /*************************************************************/
  //bluetooth
/************************************************* */

//envio de datos por bluetooth

  //mensaje de error
  async mirarerror(error) {
    let alert = await this.alertController.create({
      header: 'Error',
      subHeader: error,
      buttons: ['ok']
    });
    alert.present();
  }

  //mirarmensaje
  async mirarmensaje(mensaje) {
    const toast = await this.toastcontroller.create({
      message: mensaje,
      duration: 2000
    });
    toast.present()
  }

//envio de letrar a los sensores

  setData() {

    this.bluetoothSerial.write("b").then(Response => {
      this.mirarmensaje(Response);
      console.log("okey letra b, giro a la derecha ")
    }, error => {
      this.mirarerror(error);
      console.log("error envio letra b")
    });


  }

  setData1() {

    this.bluetoothSerial.write("a").then(Response => {
      this.mirarmensaje(Response);
      console.log("okey letra a, giro a la izquierda ")
    }, error => {
      this.mirarerror(error);
      console.log("error envio letra a")
    });


  }
  setData2() {

    this.bluetoothSerial.write("c").then(Response => {
      this.mirarmensaje(Response);
    }, error => {
      this.mirarerror(error);
      console.log("error envio letra c")
    });
  }
  setData3() {

    this.bluetoothSerial.write("d").then(Response => {
      this.mirarmensaje(Response);
    }, error => {
      this.mirarerror(error);
      console.log("error envio letra d")
    });
  }
  setData4() {

    this.bluetoothSerial.write("e").then(Response => {
      this.mirarmensaje(Response);
    }, error => {
      this.mirarerror(error);
      console.log("error envio letra e ")
    });
  }
  ngOnDestroy() {
    //el componete no busque datos no consuma datos
    if (this.loop) {
      clearInterval(this.loop);
    }
  }

}