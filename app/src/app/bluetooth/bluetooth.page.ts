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
export class BluetoothPage implements OnInit {
  disposemparejadoslist:pairedlist;
  listarToggle:boolean = false;
  emparejarIDdispositivo:number=0;
  enviardatos:string="";
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
    this.presentAlert();
    this.versielBlueestaprendido();


  }

  ngOnInit() {
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Inicar',
      message: 'Empareje con el chaleco para inicar',
      buttons: ['ok']
    });

    await alert.present();
  }
  
  iraruta(){
    
      this.router.navigate(['/home']);
  }
  /*************************************************************/
    //activar bluetooth
    versielBlueestaprendido(){
      this.bluetoothSerial.isEnabled().then(success=>{
        this.listardispositivoos();
      },error =>{
        this.mirarmensaje("Active el bluetooth del teléfono celular por favor");
      }
      );
    }

     //dispositivos a los que se a vinculado con anterioridad
  listardispositivoos(){
    this.bluetoothSerial.list().then(success=>{
      this.disposemparejadoslist = success;
      this.listarToggle = true;
    }, error=>{
      this.mirarmensaje("Active el bluetooth por favor");
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

  connect(address){
    this.bluetoothSerial.connect(address).subscribe(success =>{
        this.divaceConnected();
        this.enviardatos="comenzar";
        localStorage.setItem('permitir',this.enviardatos);
        this.mirarmensaje("Conexion con el dispositivo");
    }, error=>{
      this.mirarerror("Error en la conexión con el dispositivo");
  
    });
  }

  divaceConnected(){
    this.bluetoothSerial.subscribe('/n').subscribe(success=>{
      this.handleData(success);
      this.mirarmensaje("Conexión correcta con el dispositivo"); 
    }, error=>{
      this.mirarerror(error)
    });
  }
  diviceDescaonectado(){
    this.bluetoothSerial.disconnect();  
    this.mirarmensaje("Dispositivo desconectado");
  }
  
  handleData(valiue){
    this.mirarmensaje(valiue);
    console.log(valiue);
  }

}