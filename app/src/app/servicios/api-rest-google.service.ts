import { Injectable } from '@angular/core';
//importar cliente
import { HttpClient } from '@angular/common/http';
//imporar interface
import {Welcome} from '../modelos/json-interfaces';
//interface de ubicacion actual
import {Welcome1} from '../modelos/json-interface-ubicacionActual';
//interface de nombre de las calles
import {Welcome2} from '../modelos/nombredirecciones-interface';
//interface dentro del distrito
import {Welcome3} from '../modelos/dentrodeldistrito-interface';

import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiRestGoogleService {

  public api1='https://maps.googleapis.com';
  private key='AIzaSyBernbrysD5h9fJB2Uws1hermcdf1Bm3sw';
  private key2='AIzaSyBvukdXFVrkdyMxSvu0aIpjUq9Y6W1ehhU';

  constructor(private http: HttpClient) { }

  getDtosApiGoogle(latitudOrigen:number,longitudOrigen:number, latitudDestino:number,longitudDestino:number){
    const path = `http://34.122.13.164:3000/directions?origins=${latitudOrigen},${longitudOrigen}&destinations=${latitudDestino},${longitudDestino}&key=${this.key2}`;
    return this.http.get<Welcome>(path);
  }

  getPosicionActual(latitudOrigen:number,longitudOrigen:number,latdestino:number,lngdestino:number){
    const ruta = `http://34.122.13.164:3000/distancematrix?origins=${latitudOrigen},${longitudOrigen}&destinations=${latdestino},${lngdestino}&key=${this.key2}`;
    return this.http.get(ruta);
  }
  //&location_type=ROOFTOP
  getDatosnombrecalles(latitud:number,longitud:number){
    const path = `http://34.122.13.164:3000/geocode?geopositions=${latitud},${longitud}&key=${this.key2}`;
    return this.http.get<Welcome2>(path);
  }
  getDatosdestrodeldistrito(latitud:number,longitud:number){
    const path = `http://34.122.13.164:3000/distrito?latitudlongitud=${latitud},${longitud}&key=${this.key2}`;
    return this.http.get<Welcome3>(path);
  }
}

