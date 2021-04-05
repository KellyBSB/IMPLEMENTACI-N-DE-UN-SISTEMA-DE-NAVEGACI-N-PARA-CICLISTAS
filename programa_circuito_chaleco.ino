
                                         /* ESCUELA POLITECNICA NACIONAL 
                                        ESCUELA DE FORMACION DE TEGNOLOGOS
                                    
PROYECTO: "Implementación de un sistema de navegación para ciclistas, que le permita llegar a una dirección" 
AUTORES: Kelly Soto, Daniel Guamán
*/


// libreria para la comunicación serial bluetooth basado en el ejemplo de Evandro Copercini 
#include "BluetoothSerial.h" 

// lineas de código para comprobar si el Bluetooth esta habilitado correctamente
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

// instancia de blutoothSerial denominado esp32
BluetoothSerial esp32; 

// GPIO donde se encuentran conectados los motores de vibración   
const int motor_derecho=32;    //33
const int motor_izquierdo=25;  //26
               
void setup() {
 
  pinMode(motor_derecho,OUTPUT);     //declaración del pin como salida
  pinMode(motor_izquierdo,OUTPUT);   //declaración del pin como salida
  Serial.begin(115200);              //inicio de comunicacion serie con una velocidad 115200 baudios
  esp32.begin("chaleco smart");      //nombre del dispositivo bluetooth
  Serial.println("dispositivo coenectado exitosamente!");
}

void loop() {

  char comando;           //variable donde se guarda el comando recibido mediante Bluetooth
  
  //estas lineas comprueban si hay información disponoble para leer en la isntancia bluetooth creada
  //si los hay, esa información sera visualizada en el monitor serie
  if (esp32.available()) {
    comando=esp32.read(); //guarda los datos recibidos en la variable comando
    
  
  //esta función compara los datos recibidos y permite activar los motores de vibración
    switch(comando){
    
    case 'a':
      Serial.write(" comando 'a' recibido ---> Activación del Modo 1");
      digitalWrite (motor_derecho,HIGH);
      delay(2000);
      digitalWrite (motor_derecho,LOW);
    break;
    
    case 'b':
      Serial.write(" comando 'b' recibido ---> Activación del Modo 2");  
      digitalWrite (motor_izquierdo,HIGH);
      delay(2000);
      digitalWrite (motor_izquierdo,LOW);
    break;

    case 'c':
      Serial.write(" comando 'c' recibido ---> Activación del Modo 3");
      digitalWrite (motor_derecho,HIGH);
      digitalWrite (motor_izquierdo,HIGH);
      delay(1000);
      digitalWrite (motor_derecho,LOW);
      digitalWrite (motor_izquierdo,LOW);
      
    break;

    case 'd':
      Serial.write(" comando 'd' recibido ---> Activación del Modo 4");
      digitalWrite (motor_derecho,HIGH);
      digitalWrite (motor_izquierdo,HIGH);
      delay(2000);
      digitalWrite (motor_derecho,LOW);
      digitalWrite (motor_izquierdo,LOW);
      delay(2000),
      digitalWrite (motor_derecho,HIGH);
      digitalWrite (motor_izquierdo,HIGH);
      delay(2000);
      digitalWrite (motor_derecho,LOW);
      digitalWrite (motor_izquierdo,LOW);
   
    break;

   
    case 'e':
      Serial.write(" comando 'e' recibido ---> Activación del Modo 5"); 
      digitalWrite (motor_derecho,HIGH);
      digitalWrite (motor_izquierdo,LOW);
      delay(1000);
      digitalWrite (motor_derecho,LOW);
      digitalWrite (motor_izquierdo,HIGH);
      delay(1000),
      digitalWrite (motor_derecho,HIGH);
      digitalWrite (motor_izquierdo,LOW);
      delay(1000);
      digitalWrite (motor_derecho,LOW);
      digitalWrite (motor_izquierdo,HIGH);
      delay(1000);
      digitalWrite (motor_derecho,LOW);
      digitalWrite (motor_izquierdo,LOW);
    break; 
     
    
   
  }
  }
 
   
}
