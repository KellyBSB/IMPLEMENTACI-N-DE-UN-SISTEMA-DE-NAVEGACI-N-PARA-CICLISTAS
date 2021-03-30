import { Component, OnInit } from '@angular/core';
//bluetooth
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
//alertas
import {AlertController, ToastController} from '@ionic/angular';
//interface
import {pairedlist} from '../modelos/listarBluetooth-interface';
//touter
import { Router } from '@angular/router';
//segundo plano
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
})
export class BluetoothPage{
  //variables a utilizar
  disposemparejadoslist:pairedlist;
  listarToggle:boolean = false;
  emparejarIDdispositivo:number=0;
  enviardatos:string="";
  //el constructor de toda la app
  constructor(
    private bluetoothSerial: BluetoothSerial, 
    private alertController:AlertController,
    private toastcontroller:ToastController,
    private backgroundMode: BackgroundMode,
    private router: Router
  ) { 
 //segundo plano
 this.backgroundMode.disableWebViewOptimizations();
 this.backgroundMode.enable();
 this.backgroundMode.setEnabled(true);
 //presenta la alerta
    this.presentAlert();
    //al iniciar la app verfica que el bluetooth este prendido
    this.versielBlueestaprendido();


  }
  
//manda un mensaje de manera emergerte
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Inicar',
      message: 'Empareje con los sensores Bluetooth para inicar',
      buttons: ['ok']
    });

    await alert.present();
  }
  
  //funcion llamada desde un boton para ir a otra ventana
  iraruta(){
    
      this.router.navigate(['/home']);
  }


  /*************************************************************/
     /*BlUETOOTH  */
  ////////////////////////////////////////

    //activar bluetooth
    versielBlueestaprendido(){
      this.bluetoothSerial.isEnabled().then(success=>{
        this.listardispositivoos();
      },error =>{
        this.mirarmensaje("active el bluetooth plox =D");
      }
      );
    }

     //dispositivos a los que se a vinculado con anterioridad
  listardispositivoos(){
    this.bluetoothSerial.list().then(success=>{
      this.disposemparejadoslist = success;
      this.listarToggle = true;
    }, error=>{
      this.mirarmensaje("active el bluetooth plox =D");
      this.listarToggle=false;
    }
    
      );
  }

  //mensaje de error
async mirarerror(error){
  let alert = await this.alertController.create({
    header: 'Error',
    subHeader: error,
    buttons: ['ok']
  });
  alert.present();
  }

  //mirarmensaje
async mirarmensaje(mensaje){
  const toast = await this.toastcontroller.create({
    message:mensaje,
    duration:2000
  });
  toast.present()}

  //PERMITE selecionar algun dispositivo que se musetre en pantalla
  selecionarDispositivo(){
    let conectarDispo = this.disposemparejadoslist[this.emparejarIDdispositivo];
    if(!conectarDispo.address){
        this.mirarmensaje("Selecione el dispositivo a emparejar ");
        return;
      }  
    let address = conectarDispo.address;
    let name = conectarDispo.name;

    this.connect(address);
  }

  //conecta al dispositivo
  connect(address){
    this.bluetoothSerial.connect(address).subscribe(success =>{
        this.divaceConnected();
        this.enviardatos="comenzar";
        localStorage.setItem('permitir',this.enviardatos);
        this.mirarmensaje("Conexion con el dispositivo");
    }, error=>{
      this.mirarerror("Error en la conexion con el dispositivo </3");
  
    });
  }

  //verufuca el dispositivo vinculado
  divaceConnected(){
    this.bluetoothSerial.subscribe('/n').subscribe(success=>{
      this.handleData(success);
      this.mirarmensaje("conexion correcta con el dispositivo"); 
    }, error=>{
      this.mirarerror(error)
    });
  }

  //desconecta al dispositivo vinculado
  diviceDescaonectado(){
    this.bluetoothSerial.disconnect();  
    this.mirarmensaje("dispositivo desconectado");
  }
  
  //ayuda al menejo de datos
  handleData(valiue){
    this.mirarmensaje(valiue);
    console.log(valiue);
  }

}